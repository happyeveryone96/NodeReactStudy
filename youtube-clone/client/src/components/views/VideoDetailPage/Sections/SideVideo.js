import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo() {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    Axios.get('/api/video/getVideos')
      .then(response => {
        if (response.data.success) {
          setSideVideos(response.data.videos)
          console.log(response);
        } else {
          alert('비디오 가져오기를 실패했습니다.')
        }
      })
  },[])

  const renderSideVideo = sideVideos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor((video.duration - minutes * 60));
    return <div key={index} style={{ display:'flex', marginBottom:'1rem', padding:'0.2rem'}}>
             <div style={{ width: '40%', marginRight:'1rem'}}>
               <a href>
                 <img style={{width:'100%', height:'100%'}} src={`http://localhost:5000/${video.thumbnail}`} alt='thumbnail' />
               </a>
             </div>
             <div style={{ width:'50%'}}>
               <div style={{ color:'gray'}}>
                 <div style={{ fontSize:'1rem', color:'black'}}>{video.title}</div>
                 <div>{video.writer.name}</div>
                 <div>{video.views} views</div>
                 <div>{minutes} : {seconds}</div>
               </div>
             </div>
           </div>
  })

  return (
    <React.Fragment>
      <div style={{ marginTop:'3rem'}}>
        {renderSideVideo}
      </div>
    </React.Fragment>

    
  )
}

export default SideVideo
