import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function TextEditor({
  productDescription,
  setProductDescription,
}) {

  return (
    <div>
      <ReactQuill
        value={productDescription}
        onChange={(value) => setProductDescription(value)}
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
            ["code-block"],
          ],
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "link",
          // "image",
          // "video",
          "code-block",
        ]}
      />
      <button onClick={() => console.log(productDescription)}>Log</button>
    </div>
  );
}
