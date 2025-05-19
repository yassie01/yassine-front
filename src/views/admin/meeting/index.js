import { useState, useEffect } from "react";
import { DeleteIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { getApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CommonCheckTable from "../../../components/reactTable/checktable";
import { SearchIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import MeetingAdvanceSearch from "./components/MeetingAdvanceSearch";
import MeetingModal from "./components/MeetingModal";
import CommonDeleteModel from "../../../components/commonDeleteModel";
import { deleteManyApi } from "services/api";
import { toast } from "react-toastify";

const Index = () => {
  const title = "Meeting";
  const navigate = useNavigate();
  const [action, setAction] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedValues, setSelectedValues] = useState([]);
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
  const [searchboxOutside, setSearchboxOutside] = useState("");
  const [deleteMany, setDeleteMany] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [permission] = HasAccess(["Meetings"]);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);

  const actionHeader = {
    Header: "Action",
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Text fontSize="md" fontWeight="900" textAlign={"center"}>
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW={"fit-content"}>
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                onClick={() => navigate(`/metting/${row?.values._id}`)}
                icon={<ViewIcon fontSize={15} />}
              >
                View
              </MenuItem>
            )}
            {permission?.update && (
              <MenuItem
                py={2.5}
                color={"blue"}
                onClick={() => {
                  setSelectedValues([row?.values?._id]);
                  onOpen();
                }}
                icon={<EditIcon fontSize={15} />}
              >
                Edit
              </MenuItem>
            )}
            {permission?.delete && (
              <MenuItem
                py={2.5}
                color={"red"}
                onClick={() => {
                  setDeleteMany(true);
                  setSelectedValues([row?.values?._id]);
                }}
                icon={<DeleteIcon fontSize={15} />}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Text>
    ),
  };

  const tableColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
    },
    {
      Header: "Agenda",
      accessor: "agenda",
      cell: (cell) => (
        <Link to={`/metting/${cell?.row?.values._id}`}>
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || " - "}
          </Text>
        </Link>
      ),
    },
    { Header: "Date & Time", accessor: "dateTime" },
    { Header: "Location", accessor: "location" },
    {
      Header: "Attendees",
      accessor: "attendees",
      cell: (cell) => (
        <Text>
          {(cell.row.original.attendes?.length || 0) +
            (cell.row.original.attendesLead?.length || 0)}
          Attendees
        </Text>
      ),
    },
    { Header: "Created By ", accessor: "createBy.firstName" },
    ...(permission?.update || permission?.view || permission?.delete
      ? [actionHeader]
      : []),
  ];

  const fetchData = async () => {
    setIsLoding(true);
    try {
      const response = await getApi("api/meeting");
      setData(response.data.meetings);
    } catch (error) {
      toast.error(error.message || "Failed to fetch meetings");
    } finally {
      setIsLoding(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await getApi("api/contact");
      setContacts(response.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await getApi("api/lead");
      setLeads(response.data || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    }
  };

  const handleDeleteMeeting = async (ids) => {
    try {
      setIsLoding(true);
      const response = await deleteManyApi("api/meeting/deleteMany", ids);
      if (response.status === 200) {
        setSelectedValues([]);
        setDeleteMany(false);
        setAction((pre) => !pre);
        toast.success("Meetings deleted successfully");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete meetings");
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [action]);

  useEffect(() => {
    fetchContacts();
    fetchLeads();
  }, []);

  return (
    <div>
      <CommonCheckTable
        title={title}
        isLoding={isLoding}
        columnData={tableColumns}
        allData={data}
        tableData={data}
        searchDisplay={displaySearchData}
        setSearchDisplay={setDisplaySearchData}
        searchedDataOut={searchedData}
        setSearchedDataOut={setSearchedData}
        tableCustomFields={[]}
        access={permission}
        onOpen={onOpen}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        setDelete={setDeleteMany}
        AdvanceSearch={
          <Button
            variant="outline"
            colorScheme="brand"
            leftIcon={<SearchIcon />}
            mt={{ sm: "5px", md: "0" }}
            size="sm"
            onClick={() => setAdvanceSearch(true)}
          >
            Advance Search
          </Button>
        }
        getTagValuesOutSide={getTagValuesOutSide}
        searchboxOutside={searchboxOutside}
        setGetTagValuesOutside={setGetTagValuesOutside}
        setSearchboxOutside={setSearchboxOutside}
        handleSearchType="MeetingSearch"
      />

      <MeetingAdvanceSearch
        advanceSearch={advanceSearch}
        setAdvanceSearch={setAdvanceSearch}
        setSearchedData={setSearchedData}
        setDisplaySearchData={setDisplaySearchData}
        allData={data}
        setAction={setAction}
        setGetTagValues={setGetTagValuesOutside}
        setSearchbox={setSearchboxOutside}
      />

      <MeetingModal
        editData={
          selectedValues?.[0]
            ? data.find((item) => item._id === selectedValues[0])
            : null
        }
        contacts={contacts}
        leads={leads}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setAction((pre) => !pre);
        }}
        onSuccess={() => {
          setAction((pre) => !pre);
          onClose();
        }}
      />

      <CommonDeleteModel
        isOpen={deleteMany}
        onClose={() => setDeleteMany(false)}
        type="Meetings"
        handleDeleteData={handleDeleteMeeting}
        ids={selectedValues}
      />
    </div>
  );
};

export default Index;
