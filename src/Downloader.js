import axios from 'axios'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from './config';
function Downloader() {

  const [formats, setformats] = useState([])
  const [isloading, setLoading] = useState(false)
  const [videodata, setdata] = useState({ embed: { iframeUrl: 'https://www.youtube.com/embed/POe9SOEKotk' } })
  const formik = useFormik(
    {
      initialValues: {
        url: ""
      },
      onSubmit: async (Values) => {
        try {
          setLoading(true)
          let info = await axios.get(`https://youtubevideodownloaderguvi.onrender.com/info?url=${Values.url}`)
          setLoading(false)
          setformats(info.data.formats)
          console.log(info.data.formats)
          setdata(info.data.videoDetails)
        } catch (error) {
          console.log(error)
          setLoading(false)
          toast.warning("Internal Server Error / Invalid Link", {
            className: "tost-massage"
          })

        }
      }
    })

  let senddata = async (ev) => {
    let format = ev.target.value
    let url = videodata.video_url
    let type = ev.target.name
    setLoading(true)
    window.location.href = (`${api.download}?format=${format}&url=${url}&type=${type}`)
    setLoading(false)
  }
  return (
    <div className='text-light'>
      <div className='main-div '>
        <div className='d-flex justify-content-around '>
          <i className="bi bi-youtube" style={{ fontSize: '3rem' }}></i>
          <i className="bi bi-cloud-arrow-down-fill" style={{ fontSize: '3rem' }}></i>
        </div>
        <form className='form-div' onSubmit={formik.handleSubmit}>
          <h1>Youtube Video Downloader</h1>
          <div className='input-div container'>

            <input type='string' className='input' value={formik.values.url} onChange={formik.handleChange} name="url" />

            <button type='submit' value={'Submit'} className=' input-btn'>Start</button>
          </div>
        </form>
        <div className='pt-5'>
          <iframe className='iframe ' src={videodata.embed.iframeUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          <h4>{videodata.title}</h4>
        </div>
      </div>
      <div className='content-div'>
        {
          isloading ? <div className="d-flex justify-content-center loadinganimation">
            <div class="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div> :
            <div className=' mt-1 d-flex justify-content-center row col-md-11'>
              {
                formats.map((info, index) => {
                  function formatBytes(bytes, decimals = 2) {
                    if (!+bytes) return '0 Bytes'

                    const k = 1024
                    const dm = decimals < 0 ? 0 : decimals
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
                    const i = Math.floor(Math.log(bytes) / Math.log(k))
                    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
                  }


                  if (info.qualityLabel !== null  && info.contentLength && info.itag !== 248 && info.itag !== 247 && info.itag !== 244 && info.itag !== 243 && info.itag !== 242 && info.itag !== 278 && info.itag !== 394 &&
                    info.itag !== 395 && info.itag !== 396 && info.itag !== 397 && info.itag !== 398
                    && info.itag !== 399 && info.itag !== 400 && info.itag !== 401)
                    return (
                      <div key={index + 1} className='quality-div col-lg-2 col-md-3 col-sm-5'>
                        <button className='qualitys' key={info.itag} value={info.itag} name="Video" onClick={(ev) => senddata(ev)}>
                          <div> <i className="bi bi-play-btn-fill me-1"></i>Video</div>
                          {info.qualityLabel + "." + info.container}
                          <div>{formatBytes(info.contentLength)}</div>
                        </button>
                      </div>
                    )
                  if (info.audioBitrate === 160) {
                    return (

                      <div key={index + 1} className='quality-div col-lg-2 col-md-3 col-sm-5'>
                        <button className='qualitys' key={info.itag} value={info.itag} name='Audio' onClick={(ev) => senddata(ev)}>
                          <div> <i className="bi bi-music-note-beamed me-1"></i>Audio</div>
                          {info.audioBitrate + "k" + "." + "mp3"}
                          <div>{formatBytes(info.contentLength)}</div>
                        </button>
                      </div>
                    )
                  }



                })
              }

            </div>
        }
      </div>
      <ToastContainer
        position="bottom-center" />
    </div>
  )
}

export default Downloader