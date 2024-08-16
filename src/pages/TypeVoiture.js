import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input, notification, Popconfirm, Select } from "antd";
import { useDropzone } from 'react-dropzone';
import SideBar from "../components/SideBar";
import axios from "axios";
import { Context } from "../context";
import { DiffOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import Resizer from 'react-image-file-resizer';
import './Marques.css'; // Import the CSS file for styling
import { Option } from "antd/es/mentions";
import { getAllTypeVoiture } from "../service/TypeVoiture";
import { getAllMarquesVoiture } from "../service/MarqueVoiture";
export default function TypeVoiture() {
  const [hidden, setHidden] = useState(true);
  const [articles, setArticles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const { state } = useContext(Context);
  const { user } = state;
  const [preview, setPreview] = useState(null); // State for the preview URL  
  const [file, setFile] = useState(null); // State for the uploaded file
  const [form] = Form.useForm(); // Initialize Ant Design Form
  const [image, setImage] = useState({});
  const [typeVoiture, setTypeVoiture] = useState([]);
  const [marqueVoiture,setMarqueVoiture]=useState([])
  const [selectedMarqueVoiture,setSelectedMarqueVoiture]=useState(null)
  const [values, setValues] = useState({
    name: '',
    marque: selectedMarqueVoiture,
    annee: 2024,
    carburant: '',
  });
  const years = [];
  for (let year = 1950; year <= 2024; year++) {
    years.push(year);
  }




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}current-user`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setHidden(false);
          const typeVoitureResponse = await getAllTypeVoiture();
          const marqueVoitureResponse = await getAllMarquesVoiture()
          console.log("these are the marque Voiture Response",marqueVoitureResponse.data)
          setMarqueVoiture(marqueVoitureResponse.data)
          const mappedData = typeVoitureResponse.data.map(item => ({
            ...item,
            annee: item.année, // Map `année` to `année` property
          }));
          console.log("These are all the typePiece",typeVoitureResponse.data)
          setTypeVoiture(mappedData);
        }
      } catch (error) {
        console.log(error);
        setHidden(true);
      }
    };


    fetchUser();
  }, []);
  // Create a mapping of marqueVoiture
  const marqueMap = marqueVoiture.reduce((acc, marque) => {
    acc[marque._id] = marque.name;
    return acc;
  }, {});
  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Marque",
      dataIndex: "marque",
      key: "marque",
      render: (text, record) => marqueMap[record.marque] || 'Unknown', // Use the marqueMap for rendering
    },
    {
      title: "Année",
      dataIndex: "annee",
      key: "annee",
    },
    {
      title: "Carburant",
      dataIndex: "carburant",
      key: "carburant",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img src={record.image.Location} alt={record.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      ),
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
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}PostTypeVoiture`, {
        ...values,
        marque: selectedMarqueVoiture._id, // Ensure marque is the ObjectId
        image,
    });
      const updatedTypeVoiture = {
        ...data.typeVoiture,
        annee: data.typeVoiture.année,  // Rename 'année' to 'annee'
      };
  
      // Remove the old 'année' attribute
      delete updatedTypeVoiture.année;
      console.log(data.typeVoiture)
      notification.success({
        message: "typePiece ajoutée avec succès!",
        placement: "topRight",
        duration: 5,
      });

      setTypeVoiture([...typeVoiture, updatedTypeVoiture]);

      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
      setImage({});
    } catch (err) {
      notification.error({
        message: "Erreur lors de l'ajout du type piece!",
        description: err.response?.data,
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
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}upload-image`, { image: uri ,bucketName:"bousninatypevoituree"}, {
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
      await axios.post(`${process.env.REACT_APP_API_URL}remove-image`, { image, bucketName:"bousninatypepiece" }, {
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
      await axios.delete(`${process.env.REACT_APP_API_URL}deleteTypeVoitureById/${id}`, {
        withCredentials: true,
      });

      // Update state
      setTypeVoiture(typeVoiture.filter(typeVoiture => typeVoiture._id !== id));

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
          Ajouter un type de voiture
        </Button>

        <Table dataSource={typeVoiture} columns={columns} rowKey="_id" className="mt-4" />
        <Modal
  title="Add Type de Voiture"
  visible={isModalVisible}
  onCancel={handleCloseModal}
  footer={null}
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    <Form.Item
      name="name"
      label="Nom du type de voiture"
      rules={[{ required: true, message: "Please input the name of the car type!" }]}
    >
      <Input onChange={(e) => setValues({ ...values, name: e.target.value })} />
    </Form.Item>

            <Form.Item
              name="marque"
              label="Marque"
              rules={[{ required: true, message: "Please select the marque of the car!" }]}
            >
              <Select
                placeholder="Select a marque"
                onChange={(value) => {
                    const selectedMarque = marqueVoiture.find(marque => marque._id === value);
                    setSelectedMarqueVoiture(selectedMarque);
                    setValues({ ...values, marque: selectedMarque._id });
                }}
            >
                {marqueVoiture.map((marque) => (
                    <Option key={marque._id} value={marque._id}>
                        {marque.name}
                    </Option>
                ))}
            </Select>

            </Form.Item>

    <Form.Item
              name="annee"
              label="Année"
              rules={[{ required: true, message: "Please select the year of the car!" }]}
            >
              <Select
                placeholder="Select year"
                onChange={(value) => setValues({ ...values, annee: value })}
                value={values.annee}
              >
                {years.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
    </Form.Item>

    <Form.Item
      name="carburant"
      label="Carburant"
      rules={[{ required: true, message: "Please select the fuel type!" }]}
    >
      <Form.Item name="carburant">
        <select
          value={values.carburant}
          onChange={(e) => setValues({ ...values, carburant: e.target.value })}
        >
          <option value="">Select Fuel Type</option>
          <option value="Essence">Essence</option>
          <option value="Diesel">Diesel</option>
          <option value="Electrique">Electrique</option>
          <option value="BioEthanol">BioEthanol</option>
          <option value="Hybride (essence/électricité)">Hybride (essence/électricité)</option>
          <option value="Hybride (diesel/électrique)">Hybride (diesel/électrique)</option>
          <option value="GPL">GPL</option>
        </select>
      </Form.Item>
    </Form.Item>

    <Form.Item name="photo" label="Photo" extra="Drag and drop a file here or click to select a file">
      <div {...getRootProps({ className: "dropzone" })} style={{ textAlign: 'center', border: '1px dashed #d9d9d9', padding: '20px' }}>
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
        ) : (
          <div>
            <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
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
