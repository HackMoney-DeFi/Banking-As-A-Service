import React from "react";
// import "./qube.scss";

function Pool3D({ name }) {
  return (
    <div class="space3d">
      <div class="_3dbox">
        <h3>{name}</h3>
        <div class="_3dface _3dface--front"></div>
        <div class="_3dface _3dface--top"></div>
        <div class="_3dface _3dface--bottom"></div>
        <div class="_3dface _3dface--left"></div>
        <div class="_3dface _3dface--right"></div>
        <div class="_3dface _3dface--back"></div>
      </div>
    </div>
  );
}

export default Pool3D;
