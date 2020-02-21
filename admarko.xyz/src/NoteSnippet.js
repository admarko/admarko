import React from "react";
import moment from "moment";

export default function NoteSnippet(props) {
  const { title, summary, published } = props;
  return (
    <div>
      <h3>{title}</h3>
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
