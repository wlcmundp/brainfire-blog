import React, { useState, useEffect, useRef, useCallback } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import { EDITOR_JS_TOOLS } from "./CONSTANT";
import { createReactEditorJS } from "react-editor-js";
import { useAlert } from "react-alert";

import axios from "axios";
import CONFIG from "../config";
import { useSelector } from "react-redux";
import date from "date-and-time";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Goback from "../components/Goback";
const ReactEditorJS = createReactEditorJS();
function CreateBlog() {
  let navigate = useNavigate();
  const admin = useSelector((state) => state.login);
  const alert = useAlert();

  const [categoryList, setCategorylist] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    id: 1,
    label: "",
  });
  const [orginalCategoryList, setOrginalCategoryList] = useState([]);
  const editorRef = useRef();
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState("published");
  const setRef = (ref) => {
    editorRef.current = ref;
  };
  const handleChange = useCallback(async () => {
    const data = await editorRef.current.save();
    if (data) {
      console.log(data);
    }
  }, []);
  useEffect(() => {
    fetchcategoryList();
  }, []);

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
        setOrginalCategoryList(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const createBlog = async (imageId) => {
    let save = await editorRef.current.save();
    var axios = require("axios");
    var data = JSON.stringify({
      content: save,
      title: title,
      user: admin.id,
      status: submittedStatus,
      category: selectedCategory.id,
      description: description,
      slug: convertToSlug(title),
      image: imageId,
      comments: [],
    });

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/blogs`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        navigate("/admin/blogs");
        alert.success("Blog Added successfully");
      })
      .catch(function (error) {
        console.log(error);
      });

    console.log(save);
  };

  const uploadImage = () => {
    var data = new FormData();
    data.append("files", image);

    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/upload`,
      headers: {},
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        createBlog(response.data[0].id);
        // `${CONFIG.API_URL}${response.data[0].url}`
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const addCategory = () => {
    console.log(selectedCategory);
    var config = {
      method: "post",
      url: `${CONFIG.API_URL}/blog-categories`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        label: selectedCategory.label,
      }),
    };

    axios(config)
      .then(function (response) {
        alert.success("Catgory Added successfully");
        setCategorylist([response.data, ...orginalCategoryList]);
        setOrginalCategoryList([response.data, ...orginalCategoryList]);
        setSelectedCategory({
          id: response.data.id,
          label: response.data.label,
          changed: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const deleteCategory = (id) => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/blog-categories/${id}`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
      },
    };

    axios(config)
      .then(function (response) {
        setCategorylist(
          categoryList.filter((ele, index) => {
            if (ele.id !== id) {
              return true;
            }
          })
        );
        setOrginalCategoryList(
          orginalCategoryList.filter((ele, index) => {
            if (ele.id !== id) {
              return true;
            }
          })
        );
        alert.success("Catgory Deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title and Breadcrumbs Start */}
          <div className="mb-3 mb-md-4">
            <Goback />
            <h1 className="h3 mb-2 mb-md-1">Neuen Blog hinzufügen</h1>
            <Breadcrumb className="cb-breadcrumb">
              <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/admin/blogs">Blogs</Breadcrumb.Item>
              <Breadcrumb.Item active>
                Neuen Blogbeitrag hinzufügen
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* Title and Breadcrumbs End */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("form is submitted");
              uploadImage();
            }}
          >
            {/* Blog Form Start */}
            <div className="card cb-card mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title">Blog-Einstellungen</h2>
                <p className="card-subtitle">
                  Geben Sie die erforderlichen Informationen ein, um den Blog zu
                  veröffentlichen
                </p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Titel</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        placeholder="Enter blog title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Bild hochladen</label>
                      <div className="custom-file-upload">
                        <input
                          required
                          type="file"
                          className="form-control"
                          id="upload-blog-photo"
                          // value={image}
                          onChange={(e) => {
                            setImage(e.target.files[0]);
                          }}
                        />
                        {/* "placeholder-text" class apply when image path is not there */}
                        <label
                          className="custom-file-label placeholder-text"
                          for="upload-blog-photo"
                        >
                          Select file...
                          <span className="custom-input-btn ">
                            <i className="material-icons me-2">backup</i>
                            Browse
                          </span>
                        </label>
                      </div>
                      <p className="d-flex mb-0 fs-14 text-muted">
                        <span className="material-icons me-1">info</span>
                        Das Dateiformat JPG oder PNG wird unterstützt. Maximale
                        Dateigröße wäre 10MB.
                      </p>

                      {image ? (
                        <div className="input-group mb-3">
                          <input
                            required
                            type="text"
                            className="form-control"
                            placeholder="Recipient's username"
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            value={image.name}
                            disabled
                          />
                          {/* <span className="input-group-text" id="basic-addon2">
                            Upload
                          </span> */}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* <img
                    style={{ width: 500 }}
                    src="http://localhost:1338/uploads/neringa_hunnefeld_sz_B0t0_I1_FLA_unsplash_16454d39d3.jpg"
                  /> */}
                  <div className="col-md-6">
                    <div className="form-group  cb-form-group">
                      <label className="form-label">Kategorie</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Blog Category"
                          value={selectedCategory.label}
                          onClick={() => {
                            setShowCategoryList(true);
                          }}
                          onChange={(e) => {
                            setShowCategoryList(true);
                            var condition = new RegExp(e.target.value);
                            let m = orginalCategoryList.filter((cafi) => {
                              return condition.test(cafi.label);
                            });
                            setCategorylist(m);
                            let exactWord = false;
                            m.forEach((mword) => {
                              if (mword.label === e.target.value) {
                                exactWord = true;
                              }
                            });
                            if (exactWord) {
                              setSelectedCategory({
                                id: selectedCategory.id,
                                label: e.target.value,
                                changed: false,
                              });
                            } else {
                              if (selectedCategory.label !== e.target.value) {
                                setSelectedCategory({
                                  id: selectedCategory.id,
                                  label: e.target.value,
                                  changed: true,
                                });
                              } else {
                                setSelectedCategory({
                                  id: selectedCategory.id,
                                  label: e.target.value,
                                  changed: false,
                                });
                              }
                            }
                          }}
                          required
                        />
                        {selectedCategory.changed && selectedCategory.label ? (
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            id="button-addon2"
                            onClick={() => {
                              addCategory();
                            }}
                          >
                            Add
                          </button>
                        ) : null}
                      </div>
                      <ul
                        class="dropdown-menu  category-list w-100 list-group "
                        style={{
                          display: showCategoryList ? "block" : "none",
                          border: "none",
                          margin: 0,
                          padding: 0,
                          height: "auto",
                          overflow: "scroll",
                          maxHeight: 200,
                        }}
                      >
                        {categoryList.map((category, categoryIndex) => {
                          return (
                            <li class="list-group-item d-flex justify-content-between align-items-center list-group-item-action">
                              <span
                                className="w-100"
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setShowCategoryList(false);
                                }}
                              >
                                {category.label}
                              </span>

                              <i
                                class="material-icons me-2"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteCategory(category.id);
                                }}
                              >
                                delete
                              </i>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    {/* <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Kategorie</label>
                      <select
                        className="form-select"
                        placeholder="Select category"
                        onChange={(e) => {
                          setSelectedCategoryId(
                            categoryList[e.target.value].id
                          );
                        }}
                      >
                        <option value={null} disabled selected>
                          Kategorie auswählen
                        </option>
                        {categoryList.map((category, categoryIndex) => {
                          return (
                            <option value={categoryIndex}>
                              {category.label}
                            </option>
                          );
                        })}
                      </select>
                    </div> */}
                  </div>
                  <div className="col-md-12">
                    {/* <div className="form-group cb-form-group"> */}
                    <label className="form-label">Beschreibung</label>
                    <div className="card-body" id="editor">
                      {/* <h6>comment</h6> */}
                      <div className="form-group cb-form-group">
                        <textarea
                          required
                          type="text"
                          className="form-control form-textarea"
                          placeholder="Enter your Description"
                          value={description}
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    {/* <div className="form-group cb-form-group"> */}
                    <label className="form-label">Inhalt</label>
                    <div className="card-body" id="editor">
                      <ReactEditorJS
                        data={content}
                        // defaultValue={comment}
                        // defaultValue={comment}
                        onInitialize={(e) => {
                          setRef(e);
                        }}
                        onChange={handleChange}
                        tools={EDITOR_JS_TOOLS}
                        style={{ backgroundColor: "red" }}
                        readOnly={false}
                        // value={(e) => {
                        //   console.log(e);
                        // }}
                      />

                      {/* <h6>comment</h6> */}
                      <div className="form-group cb-form-group">
                        {/* <textarea
                type="text"
                className="form-control form-textarea"
                placeholder="Enter your comment"
              ></textarea> */}
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
            {/* Blog Form End */}

            {/* Form Actions Start */}
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0 order-md-2 d-md-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg"
                  onClick={(e) => {
                    // e.preventDefault();
                    setSubmittedStatus("draft");
                    // uploadImage("draft");
                    // createBlog("draft");
                  }}
                >
                  Entwurf speichern
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-raised btn-hover-effect btn-lg"
                  onClick={(e) => {
                    // e.preventDefault();
                    // uploadImage("published");
                    // createBlog("published");
                  }}
                >
                  veröffentlichen
                </button>
              </div>
              <div className="col-md-6 order-md-1">
                <button
                  type="reset"
                  className="btn btn-gray btn-hover-effect btn-lg"
                >
                  Formular löschen
                </button>
              </div>
            </div>
            {/* Form Actions End */}
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateBlog;
