import { CloseIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  DrawerFooter,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import { useEffect, useState } from "react";
import { BiLink } from "react-icons/bi";
import { Link } from "react-router-dom";
import { getApi } from "services/api";
// import DeleteTask from './components/deleteTask'
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";

const MeetingView = (props) => {
  const { onClose, isOpen, info, fetchData, setAction, action, access } = props;
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLoding, setIsLoding] = useState(false);
  const navigate = useNavigate();

  const fetchViewData = async () => {
    if (info) {
      setIsLoding(true);
      let result = await getApi(
        "api/meeting/view/",
        info?.event ? info?.event?.id : info
      );
      setData(result?.data);
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchViewData();
  }, [action, info]);

  const [contactAccess, leadAccess] = HasAccess(["Contacts", "Leads"]);

  const handleViewOpen = () => {
    if (info?.event) {
      navigate(`/view/${info?.event?.id}`);
    } else {
      navigate(`/view/${info}`);
    }
  };
  return (
    //
    <></>
  );
};

export default MeetingView;
