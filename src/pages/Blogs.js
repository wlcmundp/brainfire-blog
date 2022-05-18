import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import BlogImage1 from "../assets/images/blog-1.jpg";
import BlogImage2 from "../assets/images/blog-2.jpg";
import axios from "axios";
import CONFIG from "../config";
import { useSelector } from "react-redux";
import date from "date-and-time";
import Goback from "../components/Goback";
function Blogs() {
  const [show, setShow] = useState(false);
  const admin = useSelector((state) => state.login);
  const CancelToken = axios.CancelToken;
  const [source, setSource] = useState(null);
  const [list, setList] = useState([]);
  const [categoryList, setCategorylist] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState("");
  useEffect(() => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/blogs`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
      },
    };

    function convertToSlug(Text) {
      return Text.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    fetchcategoryList();
  }, []);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchcategoryList = () => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/blog-categories`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
      },
    };

    axios(config)
      .then(function (response) {
        setCategorylist(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const searchBlog = (text) => {
    if (source) {
      source.cancel("Der Vorgang wurde vom Benutzer abgebrochen.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/blogs?title_contains=${text}`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sortByCatogery = (id) => {
    let url;
    if (id === "clear") {
      url = `${CONFIG.API_URL}/blogs`;
    } else {
      url = `${CONFIG.API_URL}/blogs?category.id=${id}`;
    }
    if (source) {
      source.cancel("Der Vorgang wurde vom Benutzer abgebrochen.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);
    var config = {
      method: "get",
      url: url,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteBlog = () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/blogs/${selectedBlog}`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        let data = [];
        list.map((ele, index) => {
          if (ele.id !== selectedBlog) {
            data.push(ele);
          }
        });
        setList(data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const globalSort = (params) => {
    let url;
    if (params === "clear") {
      url = `${CONFIG.API_URL}/blogs`;
    } else {
      url = `${CONFIG.API_URL}/blogs?${params}`;
    }

    if (source) {
      source.cancel("Der Vorgang wurde vom Benutzer abgebrochen.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);
    var config = {
      method: "get",
      url: url,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const ClearSort = () => {
    let url;

    url = `${CONFIG.API_URL}/blogs`;

    if (source) {
      source.cancel("Operation wird vom Benutzer abgebrochen.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);
    var config = {
      method: "get",
      url: url,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title, Breadcrumbs and Add Button Start */}
          <div className="row mb-3 mb-md-4">
            <div className="col-md-8">
              <Goback />
              <h1 className="h3 mb-2 mb-md-1">Blogs</h1>
              <Breadcrumb className="cb-breadcrumb">
                <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Blogs</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="col-md-4 d-md-flex align-items-center justify-content-end">
              <Link
                to="/admin/add-new-blog"
                className="btn btn-primary btn-icon-text btn-raised btn-hover-effect"
              >
                <span className="material-icons me-2">add</span>
                <span className="link-text">Neuen Blog hinzufügen</span>
              </Link>
            </div>
          </div>
          {/* Title, Breadcrumbs and Add Button End */}

          {/* Search and Filter Start */}
          <div className="row mb-md-4">
            <div className="col-md-4">
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <div className="form-input-prepend">
                  <div className="input-prepend-icon">
                    <span className="material-icons">search</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by blog title..."
                    onChange={(e) => {
                      searchBlog(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <select
                  className="form-select"
                  placeholder="Select category"
                  onChange={(e) => {
                    sortByCatogery(e.target.value);
                  }}
                >
                  <option value={null} disabled selected>
                    Kategorie auswählen
                  </option>
                  {categoryList.map((category, categoryIndex) => {
                    return (
                      <option value={category.id}>{category.label}</option>
                    );
                  })}
                  {/* <option value="clear">Löschen</option> */}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <select
                  className="form-select"
                  placeholder="Sort by"
                  onChange={(e) => {
                    globalSort(e.target.value);
                  }}
                >
                  <option value="_sort=title:ASC">Titel (Aufsteigend)</option>
                  <option value="_sort=title:DESC">Titel (Absteigend)</option>
                  <option value="_sort=created_at:DESC">
                    Datum (Neuestes)
                  </option>
                  <option value="_sort=created_at:ASC">Datum (Alteste)</option>
                  {/* <option value="clear">Clear</option> */}
                </select>
              </div>
            </div>
            <div className="col-md-2 d-flex justify-content-center">
              <button
                className="btn btn-gray btn-hover-effect w-100 d-flex justify-content-center"
                onClick={(e) => {
                  e.preventDefault();
                  ClearSort();
                }}
              >
                <span className="material-icons me-2">delete</span>
                <span className="mt-auto mb-auto">Löschen</span>
              </button>
            </div>
          </div>
          {/* Search and Filter End  */}

          <p className="text-muted fs-14 mb-3">{list.length} Blogs gefunden</p>

          {/* Blog list Start */}
          <div className="row blog-list">
            {list.map((ele, index) => {
              return (
                <div className="col-md-4 col-lg-3 mb-md-4 mb-3 d-flex">
                  {/* blog card start */}
                  <div className="card cb-card card-hover-shadow card-content-equal card-action">
                    <Link
                      to={`/admin/blog-detail/${ele.slug}`}
                      state={{ blog: ele }}
                      className="card-header-media"
                    >
                      <img
                        src={`${CONFIG.API_URL}${
                          ele.image
                            ? ele.image.url
                            : "/uploads/neringa_hunnefeld_sz_B0t0_I1_FLA_unsplash_16454d39d3.jpg"
                        }`}
                        alt=""
                        className="img-fluid"
                      />
                    </Link>
                    {ele.status === "published" ? (
                      <Badge bg="success" className="cb-badge blog-status">
                        Published
                      </Badge>
                    ) : (
                      <Badge bg="gray" className="cb-badge blog-status">
                        Draft
                      </Badge>
                    )}

                    <div className="card-action-buttons">
                      <Link
                        to={`/admin/edit-blog-details/${ele.id}`}
                        state={{ blog: ele }}
                        className="btn-fab btn-secondary btn-hover-effect me-3"
                        title="Edit"
                      >
                        <span className="material-icons">edit</span>
                      </Link>
                      <button
                        className="btn-fab btn-danger btn-hover-effect"
                        onClick={() => {
                          handleShow();
                          setSelectedBlog(ele.id);
                        }}
                        title="Delete"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                    <div className="card-content-wrappper">
                      <div className="card-body">
                        <Link
                          to={`/admin/blog-detail/${ele.slug}`}
                          state={{ blog: ele }}
                        >
                          <h5 className="card-title">{ele.title}</h5>
                        </Link>
                        <Badge
                          bg="secondary"
                          className="cb-badge badge-open-round mb-2"
                        >
                          {ele.category ? ele.category.label : ""}
                        </Badge>
                        <p
                          className="card-text mb-0"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {ele.description}
                        </p>
                      </div>
                      <div className="card-footer">
                        <Link
                          to={`/admin/blog-detail/${ele.slug}`}
                          state={{ blog: ele }}
                          className="btn-link btn-icon-text btn-link-primary"
                        >
                          <span className="link-text">Mehr lesen</span>
                          <span className="material-icons ms-1">
                            arrow_forward
                          </span>
                        </Link>
                        <p className="d-flex align-items-center justify-content-end mb-0 fs-14">
                          {/* <span className="material-icons text-gray">
                            arrow_right
                          </span> */}
                          {date.format(
                            new Date(ele.created_at),
                            "DD MMM YYYY",
                            true
                          )}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* blog card end */}
                </div>
              );
            })}

            {/* blog card end */}
          </div>
          {/* Blog list End */}
        </div>

        {/* Delete Blog Popup Start */}
        <Modal
          show={show}
          onHide={handleClose}
          className="cb-modal thank-you-modal delete-modal"
          centered
        >
          <Modal.Header className="justify-content-center" closeButton>
            <div className="cb-icon-avatar cb-icon-danger cb-icon-72">
              <span className="material-icons">delete</span>
            </div>
          </Modal.Header>
          <Modal.Body className="text-center">
            <h4>Blog löschen</h4>
            <p className="mb-0">
              Sind Sie sicher, dass Sie dieses Blog löschen möchten? Dieser
              Vorgang kann nicht rückgängig gemacht werden.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              className="btn btn-gray btn-raised btn-hover-effect me-3"
              onClick={handleClose}
            >
              Abbrechen
            </button>
            <button
              className="btn btn-danger btn-raised btn-hover-effect"
              onClick={() => {
                handleClose();
                deleteBlog();
              }}
            >
              Blog löschen
            </button>
          </Modal.Footer>
        </Modal>
        {/* Delete Blog Popup End */}
      </main>
    </div>
  );
}

export default Blogs;
