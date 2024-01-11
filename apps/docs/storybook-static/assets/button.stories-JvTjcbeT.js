import{r as x}from"./index-DogsOklH.js";var m={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var P=x,g=Symbol.for("react.element"),j=Symbol.for("react.fragment"),h=Object.prototype.hasOwnProperty,w=P.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,E={key:!0,ref:!0,__self:!0,__source:!0};function y(e,r,o){var t,n={},p=null,d=null;o!==void 0&&(p=""+o),r.key!==void 0&&(p=""+r.key),r.ref!==void 0&&(d=r.ref);for(t in r)h.call(r,t)&&!E.hasOwnProperty(t)&&(n[t]=r[t]);if(e&&e.defaultProps)for(t in r=e.defaultProps,r)n[t]===void 0&&(n[t]=r[t]);return{$$typeof:g,type:e,key:p,ref:d,props:n,_owner:w.current}}s.Fragment=j;s.jsx=y;s.jsxs=y;m.exports=s;var R=m.exports;const b=R.jsx;var S=Object.defineProperty,B=Object.defineProperties,H=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertySymbols,v=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable,f=(e,r,o)=>r in e?S(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,T=(e,r)=>{for(var o in r||(r={}))v.call(r,o)&&f(e,o,r[o]);if(l)for(var o of l(r))O.call(r,o)&&f(e,o,r[o]);return e},k=(e,r)=>B(e,H(r)),I=(e,r)=>{var o={};for(var t in e)v.call(e,t)&&r.indexOf(t)<0&&(o[t]=e[t]);if(e!=null&&l)for(var t of l(e))r.indexOf(t)<0&&O.call(e,t)&&(o[t]=e[t]);return o};function i(e){var r=e,{children:o}=r,t=I(r,["children"]);return b("button",k(T({type:"button"},t),{children:o}))}i.displayName="Button";const C={component:i,argTypes:{type:{control:{type:"radio"},options:["button","submit","reset"]}}},a={render:e=>b(i,{...e,onClick:()=>{alert("Hello from Turborepo!")},children:"Hello"}),name:"Button",args:{children:"Hello",type:"button",style:{color:"blue",border:"1px solid gray",padding:10,borderRadius:10}}};var _,u,c;a.parameters={...a.parameters,docs:{...(_=a.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: props => <Button {...props} onClick={(): void => {
    // eslint-disable-next-line no-alert -- alert for demo
    alert("Hello from Turborepo!");
  }}>
      Hello
    </Button>,
  name: "Button",
  args: {
    children: "Hello",
    type: "button",
    style: {
      color: "blue",
      border: "1px solid gray",
      padding: 10,
      borderRadius: 10
    }
  }
}`,...(c=(u=a.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};const D=["Primary"];export{a as Primary,D as __namedExportsOrder,C as default};
