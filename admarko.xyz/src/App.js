import React from "react";
import "./styles/App.css";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";
import Notes from "./Notes";
import Note from "./Note";
import { BrowserRouter, Route, Switch } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/notes" component={Notes} />
            <Route exact path="/notes/:slug" render={Note} />
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
