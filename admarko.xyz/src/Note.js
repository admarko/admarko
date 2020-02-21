import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

export default function Post(props) {
  const data = props.location.state;
  const { title, author, published, body } = data;

  function createMarkup() {
    return { __html: body };
  }

  return (
    <div>
      <h1>{title}</h1>
      <hr />
      <div>
        <div>
          Published by {author.first_name} {author.last_name} on{" "}
          {moment(published).format("MMMM Do, YYYY")}
        </div>
      </div>
      <hr />
      <div dangerouslySetInnerHTML={createMarkup()} />
      <hr />
      <Link to="/notes">&larr; Back to the posts list</Link>
    </div>
  );
}
