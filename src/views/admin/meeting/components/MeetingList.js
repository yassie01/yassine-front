import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Badge,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import moment from "moment";
import { Link } from "react-router-dom";

const MeetingList = ({ meetings, onEdit, onDelete }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Agenda</Th>
          <Th>Date & Time</Th>
          <Th>Location</Th>
          <Th>Attendees</Th>
          <Th>Created By </Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {meetings.map((meeting) => (
          <Tr key={meeting._id}>
            <Td>
              <Link to={`/metting/${meeting._id}`}>
                <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
                  {meeting.agenda}
                </Text>
              </Link>
            </Td>
            <Td>{moment(meeting.dateTime).format("MMM DD, YYYY hh:mm A")}</Td>
            <Td>{meeting.location || "-"}</Td>
            <Td>
              <Badge colorScheme="blue">
                {meeting.attendes?.length + meeting.attendesLead?.length}{" "}
                Attendees
              </Badge>
            </Td>
            <Td>{meeting.createBy?.name || "-"}</Td>
            <Td>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<ChevronDownIcon />}
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem
                    icon={<ViewIcon />}
                    as={Link}
                    to={`/metting/${meeting._id}`}
                  >
                    View
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} onClick={() => onEdit(meeting)}>
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => onDelete(meeting._id)}
                    color="red.500"
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
        {meetings.length === 0 && (
          <Tr>
            <Td colSpan={6} textAlign="center" py={4}>
              No meetings found
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};

export default MeetingList;
