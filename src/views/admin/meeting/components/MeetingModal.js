import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  Select,
  Grid,
  GridItem,
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getApi, postApi, putApi } from "services/api";
import moment from "moment";

const validationSchema = Yup.object({
  agenda: Yup.string().required("Agenda is required"),
  dateTime: Yup.string().required("Date and time is required"),
  location: Yup.string(),
  notes: Yup.string(),
  attendes: Yup.array().of(Yup.string()),
  attendesLead: Yup.array().of(Yup.string()),
});

const MeetingModal = ({
  contacts,
  leads,
  isOpen,
  onClose,
  selectedValues,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const toast = useToast();

  const fetchMeetingDetails = async (id) => {
    try {
      const response = await getApi(`api/meeting/view/${id}`);
      const meetingData = response.data;
      setEditData(meetingData);

      const formattedDateTime = meetingData.dateTime
        ? moment(meetingData.dateTime).format("YYYY-MM-DDTHH:mm")
        : "";

      formik.setValues({
        agenda: meetingData.agenda || "",
        dateTime: formattedDateTime,
        location: meetingData.location || "",
        notes: meetingData.notes || "",
        attendes: meetingData.attendes?.map((contact) => contact._id) || [],
        attendesLead: meetingData.attendesLead?.map((lead) => lead._id) || [],
        related: meetingData.related || "",
        createBy: meetingData.createBy?._id || "",
        createFor: meetingData.createFor || "",
      });
    } catch (error) {
      console.error("Error fetching meeting details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch meeting details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (selectedValues?.[0]) {
        fetchMeetingDetails(selectedValues[0]);
      } else {
        setEditData(null);
        formik.resetForm();
      }
    }
  }, [isOpen, selectedValues]);

  const formik = useFormik({
    initialValues: {
      agenda: "",
      dateTime: "",
      location: "",
      notes: "",
      attendes: [],
      attendesLead: [],
      related: "",
      createBy: "",
      createFor: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          ...values,
          dateTime: moment(values.dateTime).toISOString(),
          createBy: values.createBy || editData?.createBy?._id,
        };

        if (editData) {
          await putApi(`api/meeting/edit/${editData._id}`, payload);
          toast({
            title: "Success",
            description: "Meeting updated successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          await postApi("api/meeting/create", payload);
          toast({
            title: "Success",
            description: "Meeting created successfully",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }

        onSuccess();
        onClose();
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.message ||
            `Failed to ${editData ? "update" : "create"} meeting`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const handleContactSelect = (e) => {
    const selectedId = e.target.value;
    if (!formik.values.attendes.includes(selectedId)) {
      formik.setFieldValue("attendes", [...formik.values.attendes, selectedId]);
    }
  };

  const handleLeadSelect = (e) => {
    const selectedId = e.target.value;
    if (!formik.values.attendesLead.includes(selectedId)) {
      formik.setFieldValue("attendesLead", [
        ...formik.values.attendesLead,
        selectedId,
      ]);
    }
  };

  const removeContact = (contactId) => {
    formik.setFieldValue(
      "attendes",
      formik.values.attendes.filter((id) => id !== contactId)
    );
  };

  const removeLead = (leadId) => {
    formik.setFieldValue(
      "attendesLead",
      formik.values.attendesLead.filter((id) => id !== leadId)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={formik.handleSubmit}>
          <ModalHeader>
            {editData ? "Edit Meeting" : "Create Meeting"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
                <GridItem colSpan={2}>
                  <FormControl
                    isRequired
                    isInvalid={formik.touched.agenda && formik.errors.agenda}
                  >
                    <FormLabel>Agenda</FormLabel>
                    <Input
                      name="agenda"
                      value={formik.values.agenda}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter meeting agenda"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl
                    isRequired
                    isInvalid={
                      formik.touched.dateTime && formik.errors.dateTime
                    }
                  >
                    <FormLabel>Date & Time</FormLabel>
                    <Input
                      type="datetime-local"
                      name="dateTime"
                      value={formik.values.dateTime}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter meeting location"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Related To</FormLabel>
                    <Input
                      name="related"
                      value={formik.values.related}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter related information"
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>
                      {contacts?.length > 0
                        ? "Contact Attendees"
                        : "No contacts found"}
                    </FormLabel>
                    <Select
                      name="attendes"
                      value=""
                      onChange={handleContactSelect}
                      placeholder="Select contacts"
                    >
                      {contacts?.map((contact) => (
                        <option key={contact._id} value={contact._id}>
                          {contact.fullName}
                        </option>
                      ))}
                    </Select>
                    <Box mt={2}>
                      <Wrap spacing={2}>
                        {formik.values.attendes.map((contactId) => {
                          const contact = contacts?.find(
                            (c) => c._id === contactId
                          );
                          return (
                            contact && (
                              <WrapItem key={contactId}>
                                <Tag
                                  size="md"
                                  borderRadius="full"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <TagLabel>{contact.fullName}</TagLabel>
                                  <TagCloseButton
                                    onClick={() => removeContact(contactId)}
                                  />
                                </Tag>
                              </WrapItem>
                            )
                          );
                        })}
                      </Wrap>
                    </Box>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>
                      {leads?.length > 0 ? "Lead Attendees" : "No leads found"}
                    </FormLabel>
                    <Select
                      name="attendesLead"
                      value=""
                      onChange={handleLeadSelect}
                      placeholder="Select leads"
                    >
                      {leads?.map((lead) => (
                        <option key={lead._id} value={lead._id}>
                          {lead.leadName}
                        </option>
                      ))}
                    </Select>
                    <Box mt={2}>
                      <Wrap spacing={2}>
                        {formik.values.attendesLead.map((leadId) => {
                          const lead = leads?.find((l) => l._id === leadId);
                          return (
                            lead && (
                              <WrapItem key={leadId}>
                                <Tag
                                  size="md"
                                  borderRadius="full"
                                  variant="solid"
                                  colorScheme="green"
                                >
                                  <TagLabel>{lead.leadName}</TagLabel>
                                  <TagCloseButton
                                    onClick={() => removeLead(leadId)}
                                  />
                                </Tag>
                              </WrapItem>
                            )
                          );
                        })}
                      </Wrap>
                    </Box>
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      name="notes"
                      value={formik.values.notes}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      rows={4}
                      placeholder="Enter meeting notes"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText={editData ? "Updating..." : "Creating..."}
            >
              {editData ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default MeetingModal;
