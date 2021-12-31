import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;
const Private = [
  {value: 0, label: 'Private'},
  {value: 1, label: 'Public'}
]
const CategoryOptions = [
  {value: 0, label: 'Film & Animation'},
  {value: 1, label: 'Autos & Vehicles'},
  {value: 2, label: 'Music'},
  {value: 3, label: 'Pets & Animals'},
]

function VideoUploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privateState, setPrivateState] = useState(0);
  const [category, setCategory] = useState('Film & Animation');

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  }
  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  }
  const onPrivateStateChange = (e) => {
    setPrivateState(e.target.value);
  }
  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  }
  const onDrop = (files) => {
    let formData = new FormData
    const config = {
      header: {'content-type':'multipart/form-data'}
    }
    formData.append('file', files[0]);
    Axios.post('/api/video/uploadfiles', formData, config)
      .then(response => {
        if (response.data.success) {
          console.log(response.data)
        } else {
          alert('비디오 업로드를 실패했습니다.')
        }
      })
  }
  return (
    <div>
      <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
        <div style={{ textAlign:'center', marginBottom:'2rem'}}>
          <Title level={2}>Upload Video</Title>

          <Form onSubmit style={{ textAlign:'left'}}>
            <div style={{ display:'flex', justifyContent:'space-between'}}>
              <Dropzone 
                onDrop={onDrop}
                multiple={false}
                maxSize={100000000000}>
                  {({ getRootProps, getInputProps}) => (
                  <div style={{ 
                    width: '300px', 
                    height: '240px', 
                    border: '1px solid lightgray', 
                    display:'flex',
                    alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                      <input {...getInputProps()}/>
                      <Icon type="plus" style={{ fontSize:'3rem'}}/>
                    </div>
                )}
              </Dropzone>         
              <div>
                <img src alt />
              </div>
            </div>
            <br/>
            <br/>
            <label>Title</label>
            <Input 
              onChange={onTitleChange} 
              value={title}/>
            <br/>
            <br/>
            <label>Description</label>
            <TextArea 
              onChange={onDescriptionChange} 
              value={description} />
            <br/>
            <br/>
            <select onChange={onPrivateStateChange}>
              {Private.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
              ))}
            </select>
            <br/>
            <br/>
            <select onChange={onCategoryChange}>
              {CategoryOptions.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>
              ))}
            </select>
            <br/>
            <br/>

            <Button type='primary' size='large' onClick>
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default VideoUploadPage;