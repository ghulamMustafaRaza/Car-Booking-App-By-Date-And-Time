import React from 'react'
import CircularProgress from 'material-ui/CircularProgress';

var Loader = (props) => {
    let style = (props.fullpage?{position:'fixed',top:0,width: '100vw', height:'100vh', display:'flex', justifyContent:'center',alignItems:'center'}:{display:'flex', justifyContent:'center',margin: 20})
    return(
        <div  style={style}>
            <CircularProgress size={60} thickness={8} />
        </div>
)}
export default Loader