import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";

import BlogEdit from "./pages/EditBlog";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/admin">
          <Route exact path="/admin" />
          <Route exact path="blogs" element={<Blogs />} />
          <Route exact path="add-new-blog" element={<CreateBlog />} />
          <Route exact path="blog-detail/:slug" element={<BlogDetail />} />
          <Route exact path="edit-blog-details/:id" element={<BlogEdit />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
