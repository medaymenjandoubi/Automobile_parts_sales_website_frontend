import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  notification,
  Select,
  Popconfirm,
} from "antd";
import { useDropzone } from "react-dropzone";
import SideBar from "../components/SideBar";
import axios from "axios";
import { Context } from "../context";
import { DeleteOutlined, DiffOutlined, InboxOutlined } from "@ant-design/icons";
import { getAllTypeVoiture } from "../service/TypeVoiture";
import { getAllMarques } from "../service/Marque";
import { getAllTypePiece } from "../service/TypePiece";
import { getAllPiece } from "../service/Piece";
import Resizer from "react-image-file-resizer";

const { Option } = Select;

export default function Piece() {
  const [hidden, setHidden] = useState(true);
  // const [articles, setArticles] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { state } = useContext(Context);
  const { user } = state;
  const [preview, setPreview] = useState(null); // State for the preview URL
  const [file, setFile] = useState(null); // State for the uploaded file
  const [form] = Form.useForm(); // Initialize Ant Design Form
  const [typePiece, setTypePiece] = useState([]);
  const [typeVoiture, setTypeVoiture] = useState([]);
  const [marques, setMarques] = useState([]);
  const [piece, setPiece] = useState([]);
  const [selectedMarque, setSelectedMarque] = useState(null); // State for selected marque ID
  const [selectedTypeVoiture, setSelectedTypeVoiture] = useState([]); // State for selected voiture IDs
  const [selectedTypePiece, setSelectedTypePiece] = useState(null); // State for selected type piece ID
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage the collapse/expand

  const [values, setValues] = useState({
    name: "",
    reference: "",
    price: "",
    state: "",
    marque: selectedMarque,
    compatibleCars: selectedTypeVoiture,
    typePiece: selectedTypePiece,
  });
  const [loading, setLoading] = useState(false); // Loading state for the submit button
  const [image, setImage] = useState({});

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}PostPiece`,
        {
          ...values,
          image,
        }
      );
      console.log(data.piece);
      notification.success({
        message: "typePiece ajoutée avec succès!",
        placement: "topRight",
        duration: 5,
      });
      setPiece([...piece, data.piece]);
      setIsModalVisible(false);
      form.resetFields();
      setFile(null);
      setPreview(null);
      setImage({});
    } catch (err) {
      notification.error({
        message: "Erreur lors de l'ajout du type piece!",
        description: err.response.data,
        placement: "topRight",
        duration: 5,
      });
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}current-user`,
          {
            withCredentials: true,
          }
        );
        const PieceResponse = await getAllPiece();
        const typeVoitureResponse = await getAllTypeVoiture();
        const marquesResponse = await getAllMarques();
        const typePieceResponse = await getAllTypePiece();
        setPiece(PieceResponse.data);
        setTypePiece(typePieceResponse.data);
        setTypeVoiture(typeVoitureResponse.data);
        setMarques(marquesResponse.data);
        console.log({
          typepiece: typePieceResponse.data,
          typevoiture: typeVoitureResponse.data,
          marque: marquesResponse.data,
          piece: PieceResponse.data,
        });
        setHidden(false);
      } catch (error) {
        console.log(error);
        setHidden(true);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // const { data } = await axios.get(`${process.env.REACT_APP_API_URL}articles`, {
        //   withCredentials: true,
        // });
        // setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticles();
  }, []);

  // Drag and drop functionality
  const onDrop = async (acceptedFiles) => {
    setLoading(true);
    console.log("This is the accepted file ", acceptedFiles);
    let file = acceptedFiles[0];
    setFile(file); // Set the file to state
    setPreview(URL.createObjectURL(file)); // Create a preview URL

    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}upload-image`,
          { image: uri, bucketName: "piecebousnina" },
          {
            withCredentials: true,
          }
        );
        setImage(data);
        notification.success({
          message: "Photo uploaded successfully!",
          placement: "topRight",
          duration: 5,
        });
        setLoading(false);
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
    });
  };

  const handleImageRemove = async (image) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}remove-image`,
        { image, bucketName: "piecebousnina" },
        {
          withCredentials: true,
        }
      );
      setImage({});
    } catch (err) {
      console.log(err);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields(); // Reset all fields in the form
    setFile(null); // Reset the file state
    setPreview(null); // Reset the preview state
    setSelectedMarque(null); // Reset selected marque ID
    setSelectedTypeVoiture([]); // Reset selected voiture IDs
    setSelectedTypePiece(null); // Reset selected type piece ID
    setValues({
      name: "",
      reference: "",
      price: "",
      state: "",
      marque: null,
      compatibleCars: [],
      type: null,
    }); // Reset all input values

    if (image) {
      handleImageRemove(image); // Remove the uploaded image if it exists
    }
  };
  useEffect(() => {
    console.log("this is the selected type voiture", selectedTypeVoiture);
    console.log("this is the selected type piece", selectedTypePiece);
    console.log("This is the marque", selectedMarque);

    // Update the state with the new values
    setValues((prevValues) => ({
      ...prevValues,
      marque: selectedMarque,
      typePiece: selectedTypePiece,
      compatibleCars: selectedTypeVoiture,
    }));

    //console.log("these are the updated values", values);
  }, [selectedTypeVoiture, selectedMarque, selectedTypePiece]);
  useEffect(() => {
    console.log(values);
  }, [values]);

  const handleDelete = async (id, image) => {
    try {
      // Remove image from AWS
      await handleImageRemove(image);

      // Remove item from database
      await axios.delete(
        `${process.env.REACT_APP_API_URL}deletePieceById/${id}`,
        {
          withCredentials: true,
        }
      );

      // Update state
      setPiece(piece.filter((piece) => piece._id !== id));

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
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Marque",
      dataIndex: "marque", // Assuming marque field is an ID, you might need to join with marque names if it's not directly available
      key: "marque",
      render: (text, record) => {
        // Find marque name based on ID
        const marque = marques.find((m) => m._id === record.marque);
        return marque ? marque.name : "Unknown";
      },
    },
    {
      title: "Compatible Cars",
      dataIndex: "compatibleCars", // Assuming compatibleCars is an array of IDs
      key: "compatibleCars",
      render: (text, record) => {
        // Find car names based on IDs
        console.log(record);
        const compatibleCarsNames = record.compatibleCars
          ?.map((carId) => {
            const car = typeVoiture.find((v) => v._id === carId);
            return car ? car.name : "Unknown";
          })
          .join(", ");
        return compatibleCarsNames;
      },
    },
    {
      title: "Type of Piece",
      dataIndex: "typePiece",
      key: "typePiece",
      render: (text, record) => {
        if (!typePiece.length) return "Loading..."; // Ensure typePiece has data
        const typePieceItem = typePiece.find((p) => p._id === record.typePiece);
        return typePieceItem ? typePieceItem.name : "Unknown";
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        console.log(record.image?.Location); // Add this line to log the image location
        return (
          <img
            src={record.image?.Location}
            alt={record.name}
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        );
      },
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
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle the sidebar state
  };
  return (
    <div className="flex" style={{ width: "100%" }}>
      {/* <div className="sidebar" style={{width:"30%"}}>
        <SideBar />
      </div> */}

      <div style={{ width: !isCollapsed ? "30%" : "5%" }}>
        <SideBar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          toggleSidebar={toggleSidebar}
        />
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
          Ajouter une pièce
        </Button>
        <Table
          dataSource={piece}
          columns={columns}
          rowKey="_id"
          className="mt-4"
        />
        <Modal
          title="Add Article"
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="Nom de la pièce"
              rules={[
                {
                  required: true,
                  message: "Please input the name of the part!",
                },
              ]}
            >
              <Input
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item
              name="reference"
              label="Référence"
              rules={[
                { required: true, message: "Please input the reference!" },
              ]}
            >
              <Input
                onChange={(e) =>
                  setValues({ ...values, reference: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Prix"
              rules={[{ required: true, message: "Please input the price!" }]}
            >
              <Input
                type="number"
                onChange={(e) =>
                  setValues({ ...values, price: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              name="state"
              label="État"
              rules={[{ required: true, message: "Please select the state!" }]}
            >
              <Select
                onChange={(value) => setValues({ ...values, state: value })}
              >
                <Option value="Neuf">Neuf</Option>
                <Option value="Utilisé">Utilisé</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="brand"
              label="Marque de la pièce"
              rules={[{ required: true, message: "Please select the brand!" }]}
            >
              <Select value={selectedMarque} onChange={setSelectedMarque}>
                {marques.map((marque) => (
                  <Option key={marque._id} value={marque._id}>
                    {marque.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="compatibleCars"
              label="Voiture compatible"
              rules={[
                { required: true, message: "Please select compatible cars!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select compatible cars"
                value={selectedTypeVoiture}
                onChange={setSelectedTypeVoiture}
              >
                {typeVoiture.map((voiture) => (
                  <Option key={voiture._id} value={voiture._id}>
                    {voiture.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="type"
              label="Type de pièce"
              rules={[
                { required: true, message: "Please select the type of part!" },
              ]}
            >
              <Select value={selectedTypePiece} onChange={setSelectedTypePiece}>
                {typePiece.map((piece) => (
                  <Option key={piece?._id} value={piece?._id}>
                    {piece?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="photo"
              label="Photo"
              extra="Drag and drop a file here or click to select a file"
            >
              <div
                {...getRootProps({ className: "dropzone" })}
                style={{
                  textAlign: "center",
                  border: "1px dashed #d9d9d9",
                  padding: "20px",
                }}
              >
                <input {...getInputProps()} />
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div>
                    <InboxOutlined
                      style={{ fontSize: "48px", color: "#d9d9d9" }}
                    />
                    <p style={{ color: "green" }}>
                      Drag & drop some files here, or click to select files
                    </p>
                  </div>
                )}
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
