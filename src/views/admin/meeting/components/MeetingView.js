import {
  Box,
  Grid,
  GridItem,
  Text,
  Heading,
  useDisclosure,
  Flex,
  IconButton,
  useToast,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getApi, deleteApi } from "services/api";
import Card from "components/card/Card";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import MeetingModal from "./MeetingModal";

const MeetingView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMeeting = async () => {
    try {
      setLoading(true);
      const response = await getApi(`api/meeting/view/${id}`);
      setMeeting(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch meeting details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/metting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteApi(`api/meeting/delete/${id}`);
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/metting");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete meeting",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justify="center" align="center" h="200px">
          <Spinner />
        </Flex>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">{meeting.agenda}</Heading>
          <Flex gap={2}>
            <IconButton
              icon={<EditIcon />}
              onClick={onOpen}
              colorScheme="blue"
              variant="outline"
            />
            <IconButton
              icon={<DeleteIcon />}
              onClick={handleDelete}
              colorScheme="red"
              variant="outline"
            />
          </Flex>
        </Flex>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Text fontWeight="bold" mb={2}>
              Date & Time
            </Text>
            <Text>
              {moment(meeting.dateTime).format("MMMM DD, YYYY hh:mm A")}
            </Text>
          </GridItem>

          <GridItem>
            <Text fontWeight="bold" mb={2}>
              Location
            </Text>
            <Text>{meeting.location || "-"}</Text>
          </GridItem>

          <GridItem colSpan={2}>
            <Text fontWeight="bold" mb={2}>
              Notes
            </Text>
            <Text whiteSpace="pre-wrap">{meeting.notes || "-"}</Text>
          </GridItem>
        </Grid>

        <Divider my={6} />

        <Box>
          <Text fontWeight="bold" mb={4}>
            Attendees
          </Text>

          {meeting.attendes?.length > 0 && (
            <Box mb={4}>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Contacts
              </Text>
              <Flex wrap="wrap" gap={4}>
                {meeting.attendes.map((contact) => (
                  <Flex
                    key={contact._id}
                    align="center"
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                  >
                    <Avatar
                      size="sm"
                      name={`${contact.firstName} ${contact.lastName}`}
                      mr={2}
                    />
                    <Text>
                      {contact.firstName} {contact.lastName}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}

          {meeting.attendesLead?.length > 0 && (
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Leads
              </Text>
              <Flex wrap="wrap" gap={4}>
                {meeting.attendesLead.map((lead) => (
                  <Flex
                    key={lead._id}
                    align="center"
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                  >
                    <Avatar
                      size="sm"
                      name={`${lead.firstName} ${lead.lastName}`}
                      mr={2}
                    />
                    <Text>
                      {lead.firstName} {lead.lastName}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          )}
        </Box>

        <Divider my={6} />

        <Box>
          <Text fontWeight="bold" mb={2}>
            Created By Created By
          </Text>
          <Flex align="center">
            <Avatar size="sm" name={meeting.createBy?.name} mr={2} />
            <Text>{meeting.createBy?.name || "-"}</Text>
          </Flex>
        </Box>
      </Card>

      <MeetingModal
        isOpen={isOpen}
        onClose={onClose}
        meeting={meeting}
        onSuccess={() => {
          fetchMeeting();
          onClose();
        }}
      />
    </Box>
  );
};

export default MeetingView;
