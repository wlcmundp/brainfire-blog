import React, { useState, useEffect, useRef, useCallback } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import BlogDetailImage from "../assets/images/blog-detail.jpg";
import axios from "axios";
import CONFIG from "../config";
import { useSelector } from "react-redux";
import { EDITOR_JS_TOOLS } from "./CONSTANT";
import { createReactEditorJS } from "react-editor-js";
import { useAlert } from "react-alert";
import date from "date-and-time";
import { useParams, useLocation } from "react-router-dom";
import Goback from "../components/Goback";
const ReactEditorJS = createReactEditorJS();

function BlogDetail() {
  let params = useParams();
  let location = useLocation();
  const admin = useSelector((state) => state.login);
  const alert = useAlert();
  const editorRef = useRef(null);
  const setRef = (ref) => {
    editorRef.current = ref;
  };
  const handleChange = useCallback(async () => {
    const data = await editorRef.current.save();
    if (data) {
      console.log(data);
    }
  }, []);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const [blogId, setBlogId] = useState("");
  const [commenInput, setCommenInput] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  useEffect(() => {
    if (location.state.blog) {
      let response = location.state.blog;
      console.log(response.content);
      setContent(response.content);
      setTitle(response.title);
      setStatus(response.status);
      setCreatedAt(
        date.format(new Date(response.created_at), "DD MMM YYYY", true)
      );
      setDescription(response.description);
      setImage(
        response.image
          ? response.image.url
          : "/uploads/neringa_hunnefeld_sz_B0t0_I1_FLA_unsplash_16454d39d3.jpg"
      );
      setCategory(response.category ? response.category.label : "");
      setCommentList(response.comments);
      setBlogId(response.id);
      console.log(response);
    }
    console.log(params, location);
  }, []);

  const addReply = () => {
    var axios = require("axios");
    var data = JSON.stringify({
      text: commenInput,
      blog: blogId,
      user: admin.id,
      reply: true,
      comment: selectedComment.id,
    });

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/comments`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        setCommenInput("");

        let Data = [];
        commentList.forEach((ele, index) => {
          if (ele.id === response.data.comment.id) {
            ele.replies.push(response.data);
          }
          Data.push(ele);
        });
        setCommentList(Data);
        setSelectedComment("");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const addComment = () => {
    if (selectedComment) {
      addReply();
    } else {
      var data = JSON.stringify({
        text: commenInput,
        blog: blogId,
        user: admin.id,
        reply: false,
      });

      var config = {
        method: "post",
        url: `${CONFIG.API_URL}/comments`,
        headers: {
          // Authorization: `Bearer ${admin.jwt}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          setCommentList((ele) => [...commentList, response.data]);
          setCommenInput("");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title and Breadcrumbs Start */}
          <div className="row mb-3">
            <div className="col-md-8">
              <Goback />
              <h1 className="h3 mb-2 mb-md-1">{title}</h1>
              <Breadcrumb className="cb-breadcrumb">
                <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item href="/admin/blogs">Blogs</Breadcrumb.Item>
                <Breadcrumb.Item active>{title}</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="col-md-4 d-md-flex align-items-center justify-content-end card-action-buttons">
              <Link
                to={`/admin/edit-blog-details/${location.state.blog.id}`}
                state={{ blog: location.state.blog }}
                className="btn-fab btn-secondary btn-hover-effect me-3"
                title="Bearbeiten"
              >
                <span className="material-icons">edit</span>
              </Link>
              {/* <button
                className="btn-fab btn-danger btn-hover-effect"
                title="Delete"
              >
                <span className="material-icons">delete</span>
              </button> */}
            </div>
          </div>
          {/* Title and Breadcrumbs End */}

          {/* Tag and Date Start */}
          <div className="d-md-flex align-items-center justify-content-between mb-2">
            <div>
              {status === "published" ? (
                <Badge bg="success" className="cb-badge blog-status">
                  Veröffentlicht
                </Badge>
              ) : (
                <Badge bg="gray" className="cb-badge blog-status">
                  Entwurf
                </Badge>
              )}
              <span className="me-2 text-muted">|</span>
              <Badge bg="secondary" className="cb-badge mb-2 me-2 mb-md-0">
                {category}
              </Badge>
            </div>
            <p className="d-flex align-items-center mb-0 fs-14">
              <span className="font-weight-bold me-1 text-black">
                Veröffentlicht am:
              </span>
              {created_at}
            </p>
          </div>
          {/* Tag and Date End */}

          {/* Blog Description and Comment Start */}
          <div className="card cb-card mb-4 mb-md-5">
            <div className="card-body blog-detail">
              <div className="blog-card-media blog-detail-image">
                <img
                  src={`${CONFIG.API_URL}${image}`}
                  alt=""
                  className="img-fluid"
                />
              </div>
              <p
                className="blog-description"
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
            </div>

            <ReactEditorJS
              data={location.state.blog.content}
              defaultValue={location.state.blog.content}
              // defaultValue={comment}
              onInitialize={(e) => {
                setRef(e);
              }}
              onChange={handleChange}
              tools={EDITOR_JS_TOOLS}
              style={{ backgroundColor: "red" }}
              readOnly={true}
              minHeight={0}
              // value={(e) => {
              //   console.log(e);
              // }}
            />
            <div className="card-body d-flex align-items-center">
              <span className="font-weight-bold me-2 text-black fs-14">
                Teilen Sie das auf:
              </span>
              <ul className="list-inline blog-social-links mb-0">
                <li className="list-inline-item">
                  <a href="/admin" className="social-icon" title="Facebook">
                    <svg
                      width="10"
                      height="20"
                      viewBox="0 0 10 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_210_63)">
                        <path
                          d="M2.62113 20V10.6154H0.139648V7.23652H2.62113V4.3505C2.62113 2.08264 4.08695 0 7.46451 0C8.83203 0 9.84325 0.1311 9.84325 0.1311L9.76357 3.28642C9.76357 3.28642 8.73229 3.27638 7.60691 3.27638C6.38891 3.27638 6.19377 3.83768 6.19377 4.7693V7.23652H9.86039L9.70085 10.6154H6.19377V20H2.62113Z"
                          fill="#000"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_210_63">
                          <rect
                            width="9.72074"
                            height="20"
                            fill="white"
                            transform="translate(0.139648)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="/admin" className="social-icon" title="Instagram">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 7.39658C8.56644 7.39658 7.39652 8.5665 7.39652 10.0001C7.39652 11.4337 8.56644 12.6036 10 12.6036C11.4336 12.6036 12.6035 11.4337 12.6035 10.0001C12.6035 8.5665 11.4336 7.39658 10 7.39658ZM17.8086 10.0001C17.8086 8.92197 17.8184 7.85361 17.7578 6.77744C17.6973 5.52744 17.4121 4.41806 16.4981 3.504C15.5821 2.58798 14.4746 2.30478 13.2246 2.24423C12.1465 2.18369 11.0782 2.19345 10.002 2.19345C8.92386 2.19345 7.8555 2.18369 6.77933 2.24423C5.52933 2.30478 4.41995 2.58994 3.50589 3.504C2.58988 4.42001 2.30667 5.52744 2.24613 6.77744C2.18558 7.85556 2.19534 8.92392 2.19534 10.0001C2.19534 11.0763 2.18558 12.1466 2.24613 13.2227C2.30667 14.4727 2.59183 15.5821 3.50589 16.4962C4.42191 17.4122 5.52933 17.6954 6.77933 17.7559C7.85745 17.8165 8.92581 17.8067 10.002 17.8067C11.0801 17.8067 12.1485 17.8165 13.2246 17.7559C14.4746 17.6954 15.584 17.4102 16.4981 16.4962C17.4141 15.5802 17.6973 14.4727 17.7578 13.2227C17.8203 12.1466 17.8086 11.0782 17.8086 10.0001ZM10 14.0059C7.78323 14.0059 5.99417 12.2169 5.99417 10.0001C5.99417 7.7833 7.78323 5.99423 10 5.99423C12.2168 5.99423 14.0059 7.7833 14.0059 10.0001C14.0059 12.2169 12.2168 14.0059 10 14.0059ZM14.17 6.76572C13.6524 6.76572 13.2344 6.34775 13.2344 5.83017C13.2344 5.31259 13.6524 4.89462 14.17 4.89462C14.6875 4.89462 15.1055 5.31259 15.1055 5.83017C15.1057 5.95307 15.0816 6.0748 15.0346 6.18837C14.9876 6.30195 14.9187 6.40514 14.8318 6.49205C14.7449 6.57895 14.6417 6.64786 14.5282 6.69482C14.4146 6.74178 14.2929 6.76587 14.17 6.76572Z"
                        fill="#000"
                      />
                    </svg>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="/admin" className="social-icon" title="Linkedin">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_210_73)">
                        <path
                          d="M4.54012 19.5587V6.66013H0.252884V19.5587H4.54012ZM2.39705 4.89799C3.89209 4.89799 4.82267 3.90753 4.82267 2.66979C4.79482 1.40413 3.89214 0.441162 2.42542 0.441162C0.958934 0.441162 -6.10352e-05 1.40415 -6.10352e-05 2.66979C-6.10352e-05 3.90759 0.930296 4.89799 2.36907 4.89799H2.39692H2.39705ZM6.91308 19.5587H11.2003V12.3555C11.2003 11.97 11.2282 11.5849 11.3414 11.3093C11.6513 10.5391 12.3567 9.74136 13.5411 9.74136C15.0924 9.74136 15.7131 10.9242 15.7131 12.6582V19.5586H20V12.1627C20 8.20076 17.8849 6.35731 15.0642 6.35731C12.7514 6.35731 11.7359 7.65008 11.1718 8.53058H11.2004V6.65987H6.91318C6.96944 7.8702 6.91318 19.5584 6.91318 19.5584L6.91308 19.5587Z"
                          fill="#000"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_210_73">
                          <rect
                            width="20"
                            height="19.1175"
                            fill="white"
                            transform="translate(0 0.441162)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card-footer card-footer-border">
              <h5 className="mb-3">Kommentare ({commentList.length})</h5>

              <ul className="list-unstyled comment-list">
                {commentList.map((ele, index) => {
                  return (
                    <>
                      <li className="d-md-flex align-items-start">
                        <div className="me-3 flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="cb-icon-avatar cb-icon-secondary me-3">
                              {ele.user.firstname[0] + ele.user.lastname[0]}
                            </div>
                            <div className="d-md-flex align-items-center comment-title">
                              <h6 className="mb-0">
                                {" "}
                                {ele.user.firstname + ele.user.lastname}
                              </h6>
                              <span className="ms-2 me-2 d-none d-md-inline-flex">
                                |
                              </span>
                              <span className="text-muted fs-14">
                                {date.format(
                                  new Date(ele.created_at),
                                  "DD MMM YYYY",
                                  true
                                )}
                              </span>
                            </div>
                          </div>
                          <p className="fs-14 mb-2 mb-md-0">{ele.text}</p>
                        </div>
                        <div
                          className="btn-link btn-icon-text btn-link-secondary"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            document
                              .getElementById("commentId")
                              .scrollIntoView({
                                behavior: "smooth",
                                block: "end",
                                inline: "nearest",
                              });
                            setSelectedComment(ele);
                          }}
                        >
                          <span className="material-icons me-1">reply</span>
                          <span className="link-text">Antworten</span>
                        </div>
                      </li>
                      {ele.replies.length > 0 ? (
                        <>
                          {ele.replies.map((reply, replyIndex) => {
                            return (
                              <li
                                className="d-md-flex align-items-start"
                                style={{ marginLeft: 20 }}
                              >
                                <div className="me-3 flex-grow-1">
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="cb-icon-avatar cb-icon-secondary me-3">
                                      {reply.user.firstname[0] +
                                        reply.user.lastname[0]}
                                    </div>
                                    <div className="d-md-flex align-items-center comment-title">
                                      <h6 className="mb-0">
                                        {" "}
                                        {reply.user.firstname +
                                          reply.user.lastname}
                                      </h6>
                                      <span className="ms-2 me-2 d-none d-md-inline-flex">
                                        |
                                      </span>
                                      <span className="text-muted fs-14">
                                        {date.format(
                                          new Date(reply.created_at),
                                          "DD MMM YYYY",
                                          true
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="fs-14 mb-2 mb-md-0">
                                    {reply.text}
                                  </p>
                                </div>
                                {/* <Link
                                  to="/admin"
                                  className="btn-link btn-icon-text btn-link-secondary"
                                >
                                  <span className="material-icons me-1">
                                    reply
                                  </span>
                                  <span className="link-text">Reply</span>
                                </Link> */}
                              </li>
                            );
                          })}
                        </>
                      ) : null}
                    </>
                  );
                })}
              </ul>
              <div className="post-comment" id="commentId">
                <h5 className="mb-3">Kommentar abgeben</h5>
                <div className="form-group cb-form-group mb-3 mb-md-4">
                  <label className="form-label">Ihr Kommentar</label>
                  {selectedComment ? (
                    <label className="form-label">
                      Antworten auf @
                      {selectedComment.user.firstname +
                        " " +
                        selectedComment.user.lastname}
                    </label>
                  ) : null}
                  <textarea
                    type="text"
                    className="form-control form-textarea"
                    placeholder="Enter your comment"
                    value={commenInput}
                    onChange={(e) => {
                      setCommenInput(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div className="">
                  <button
                    className="btn btn-primary btn-raised btn-hover-effect me-2 me-md-3"
                    onClick={(e) => {
                      e.preventDefault();
                      addComment();
                    }}
                  >
                    Absenden
                  </button>
                  <button
                    className="btn btn-gray btn-hover-effect"
                    onClick={(e) => {
                      e.preventDefault();
                      setCommenInput("");
                      setSelectedComment("");
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Blog Description and Comment End */}
        </div>
      </main>
    </div>
  );
}

export default BlogDetail;
