import "intersection-observer";
import * as React from "react";
import { Helmet } from "react-helmet-async";
// The doc prop contains some metadata about the page being rendered that you can use.
const Wrapper = ({ children }) => (
  <>
    <Helmet>
      <link rel="icon" type="image/png" href="/public/favicon.png" />
    </Helmet>
    {children}
  </>
);
export default Wrapper;
