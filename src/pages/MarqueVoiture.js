import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input, notification, Popconfirm } from "antd";
import { useDropzone } from 'react-dropzone';
import SideBar from "../components/SideBar";
import axios from "axios";
import { Context } from "../context";
import { DiffOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import Resizer from 'react-image-file-resizer';
import './Marques.css'; // Import the CSS file for styling
import { getAllMarquesVoiture } from "../service/MarqueVoiture";
import { getAllTypeVoiture } from "../service/TypeVoiture";

export default function MarqueVoiture() {
  const [hidden, setHidden] = useState(true);
  const [articles, setArticles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state } = useContext(Context);
  const { user } = state;
  const [preview, setPreview] = useState(null); // State for the preview URL  
  const [file, setFile] = useState(null); // State for the uploaded file
  const [form] = Form.useForm(); // Initialize Ant Design Form
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const [image, setImage] = useState({});
  const [selectedTypeVoiture, setSelectedTypeVoiture] = useState([]); // State for selected voiture IDs
  const [values, setValues] = useState({
    name: '',
    types:selectedTypeVoiture,
  });
  const [marquesVoiture,setMarquesVoiture]=useState(null)
  const [typeVoiture, setTypeVoiture] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}current-user`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setHidden(false);
          const marquesResponse = await getAllMarquesVoiture();
          const typeVoitureResponse = await getAllTypeVoiture();

          console.log("These are all the marques",marquesResponse.data)
          setMarquesVoiture(marquesResponse.data);
          setTypeVoiture(typeVoitureResponse.data);

        }
      } catch (error) {
        console.log(error);
        setHidden(true);
      }
    };


    fetchUser();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
        title: "Types de Voitures",
        dataIndex: "types",
        key: "types",
        render: (types) => {
          if (!types || types.length === 0) {
            return "Aucun type";
          }
  
          // Map the types to their corresponding names
          return types
            .map((typeId) => {
              const type = typeVoiture.find((t) => t._id === typeId);
              return type ? type.name : "Type inconnu";
            })
            .join(", ");
        },
      },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        console.log(record.image.Location); // Add this line to log the image location
        return (
          <img src={record.image.Location} alt={record.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
          onConfirm={() => handleDelete(record._id, record.image)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  // Function to submit the form
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}PostMarqueVoiture`, {
        ...values, image,
      });
      console.log(data.marqueVoiture)
      notification.success({
        message: "Marque ajoutée avec succès!",
        placement: "topRight",
        duration: 5,
      });
      setMarquesVoiture([...marquesVoiture, data.marqueVoiture]);

      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
      setImage({});
    } catch (err) {
      notification.error({
        message: "Erreur lors de l'ajout de la marque!",
        description: err.response.data,
        placement: "topRight",
        duration: 5,
      });
    }
  }

  // Drag and drop functionality
  const onDrop = async (acceptedFiles) => {
    setLoading(true)
    console.log("This is the accepted file ", acceptedFiles)
    let file = acceptedFiles[0]
    setFile(file); // Set the file to state
    setPreview(URL.createObjectURL(file)); // Create a preview URL

    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}upload-image`, { image: uri ,bucketName:"bousninamarquevoiture"}, {
          withCredentials: true,
        });
        setImage(data)
        notification.success({
          message: "Photo uploaded successfully!",
          placement: "topRight",
          duration: 5,
        });
        setLoading(false)

      } catch (error) {
        //setLoading(false)
        console.log(error);
        notification.error({
          message: "Failed to upload photo!",
          description: "Please try again later.",
          placement: "topRight",
          duration: 5,
        });
      }
    })
  };

  const handleImageRemove = async (image) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}remove-image`, { image, bucketName:"bousninamarquevoiture" }, {
        withCredentials: true,
      });
      setImage({});
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = async (id, image) => {
    try {
      // Remove image from AWS
      await handleImageRemove(image);

      // Remove item from database
      await axios.delete(`${process.env.REACT_APP_API_URL}deleteMarqueVoitureById/${id}`, {
        withCredentials: true,
      });

      // Update state
      setMarquesVoiture(marquesVoiture.filter(marque => marque._id !== id));

      notification.success({
        message: "Item deleted successfully!",
        placement: "topRight",
        duration: 5,
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Failed to delete item!",
        description: "Please try again later.",
        placement: "topRight",
        duration: 5,
      });
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    handleImageRemove(image)
    setIsModalVisible(false);
    form.resetFields(); // Reset all fields in the form
    setFile(null); // Reset the file state
    setPreview(null); // Reset the preview state
  };

  return (
    <div className="flex" style={{width:"100%"}}>
      <div className="sidebar" style={{width:"25%"}}>
        <SideBar />
      </div>
      <div className="main-content">
        <Button
          type="primary"
          onClick={handleOpenModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <DiffOutlined />
          Ajouter une marque de voiture
        </Button>

        <Table dataSource={marquesVoiture} columns={columns} rowKey="_id" className="mt-4" />
        <Modal
          title="Add Article"
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Nom de la marque"
              rules={[{ required: true, message: "Please input the name of the Brand!" }]}
            >
              <Input onChange={(e) => setValues({ ...values, name: e.target.value })} />
            </Form.Item>
            <Form.Item name="photo" label="Photo" extra="Drag and drop a file here or click to select a file">
    <div {...getRootProps({ className: "dropzone" })} style={{ textAlign: 'center', border: '1px dashed #d9d9d9', padding: '20px' }}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
      ) : (
        <div>
          <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' ,pointer: ""}} />
          <p style={{ color: 'green' }}>Drag & drop some files here, or click to select files</p>
        </div>
      )}
    </div>
  </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}