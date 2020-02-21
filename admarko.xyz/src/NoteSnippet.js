import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

export default function NoteSnippet(props) {
  const { title, summary, published, slug } = props;
  return (
    <div>
      <h3>
        <Link to={{ pathname: `notes/${slug}`, state: props }}> {title}</Link>
      </h3>
      <p>{summary}</p>
      <div>
        <div>
          By {props.author.first_name} {props.author.last_name}
        </div>
        <span>Published on {moment(published).format("YYYY-MM-DD")}</span>
      </div>
    </div>
  );
}
