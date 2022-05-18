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
import { useParams, useLocation } from "react-router-dom";
import Goback from "../components/Goback";
const ReactEditorJS = createReactEditorJS();
function CreateBlog() {
  const admin = useSelector((state) => state.login);
  const alert = useAlert();
  let location = useLocation();
  const [categoryList, setCategorylist] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    id: 1,
    label: "",
  });
  const [showCategoryList, setShowCategoryList] = useState(false);

  const [blogId, setBlogId] = useState("");
  const [orginalCategoryList, setOrginalCategoryList] = useState([]);

  const [catogeryIdServer, setCatogeryIdServer] = useState("");
  const editorRef = useRef();
  const [newImageAdded, setNewImageAdded] = useState(false);
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
    let response = location.state.blog;
    console.log(response.content);
    setContent(response.content);
    setTitle(response.title);
    setStatus(response.status);

    setDescription(response.description);
    setImage(response.image);
    setSelectedCategory(
      response.category
        ? response.category
        : {
            id: 7777,
            label: "",
          }
    );
    //   setCommentList(response.comments);
    setBlogId(response.id);

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
        if (response.data.length > 0 && selectedCategory.id === 7777) {
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

  const updateBlog = async (imageId) => {
    let save = await editorRef.current.save();
    var data = JSON.stringify({
      content: save,
      title: title,
      user: admin.userid,
      status: status,
      category: selectedCategory.id,
      description: description,
      slug: convertToSlug(title),
      image: newImageAdded ? imageId : image.id,
      //   comments: [],
    });

    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/blogs/${blogId}`,
      headers: {
        // Authorization: `Bearer ${admin.jwt}`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
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
        updateBlog(response.data[0].id);
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
            <h1 className="h3 mb-2 mb-md-1">Neuen Blogbeitrag hinzufügen</h1>
            <Breadcrumb className="cb-breadcrumb">
              <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/admin/blogs">Blogs</Breadcrumb.Item>
              <Breadcrumb.Item active>
                Neuen Blogbeitrag hinzufügen
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* Title and Breadcrumbs End */}

          <form>
            {/* Blog Form Start */}
            <div className="card cb-card mb-3 mb-md-4">
              <div className="card-header card-header-border card-title-separator">
                <h2 className="h5 card-title">Blog-Einstellungen</h2>
                <p className="card-subtitle">
                  Geben Sie unten die erforderlichen Informationen ein, um den
                  Blogbeitrag zu veröffentlichen
                </p>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Titel</label>
                      <input
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
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        placeholder="Select category"
                        value={status}
                        onChange={(e) => {
                          setStatus(e.target.value);
                        }}
                      >
                        <option value={null} disabled selected>
                          Choose Status
                        </option>
                        <option value="draft">Entwurf</option>
                        <option value="published">Veröffentlicht</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group cb-form-group mb-3 mb-md-4">
                      <label className="form-label">Bild hochladen</label>
                      <div className="custom-file-upload">
                        <input
                          type="file"
                          className="form-control"
                          id="upload-blog-photo"
                          onChange={(e) => {
                            setNewImageAdded(true);
                            setImage(e.target.files[0]);
                          }}
                        />
                        {/* "placeholder-text" class apply when image path is not there */}
                        <label
                          className="custom-file-label placeholder-text"
                          for="upload-blog-photo"
                        >
                          Datei auswählen...
                          <span className="custom-input-btn ">
                            <i className="material-icons me-2">backup</i>
                            Durchsuchen
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
                        placeholder="Kategorie auswählen"
                        value={selectedCategoryId}
                        onChange={(e) => {
                          setSelectedCategoryId(e.target.value);
                        }}
                      >
                        <option value={null} disabled selected>
                          Kategorie auswählen
                        </option>
                        {categoryList.map((category, categoryIndex) => {
                          return (
                            <option value={category.id}>
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
                          type="text"
                          className="form-control form-textarea"
                          placeholder="Geben Sie Ihre Beschreibung ein"
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
                        data={location.state.blog.content}
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
                {/* <button
                  className="btn btn-secondary btn-hover-effect me-2 me-md-3 btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    updateBlog("draft");
                  }}
                >
                  Save Draft
                </button> */}
                <button
                  type="submit"
                  className="btn btn-primary btn-raised btn-hover-effect btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    if (newImageAdded) {
                      uploadImage();
                    } else {
                      updateBlog();
                    }
                  }}
                >
                  Update
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
