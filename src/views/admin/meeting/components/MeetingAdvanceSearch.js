import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Grid,
  GridItem,
  Input,
  FormLabel,
  Button,
  FormControl,
  VStack,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import moment from "moment";
import {
  getSearchData,
  setGetTagValues,
} from "../../../../redux/slices/advanceSearchSlice";
import { useDispatch } from "react-redux";

const MeetingAdvanceSearch = (props) => {
  const {
    allData,
    advanceSearch,
    setAdvanceSearch,
    isLoding,
    setSearchedData,
    setDisplaySearchData,
    setSearchbox,
  } = props;

  const dispatch = useDispatch();
  const initialValues = {
    agenda: "",
    location: "",
    fromDateTime: "",
    toDateTime: "",
  };
  const validationSchema = yup.object({
    agenda: yup.string(),
    location: yup.string(),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const searchResult = allData.filter((item) => {
        const matchAgenda =
          !values.agenda ||
          item.agenda.toLowerCase().includes(values.agenda.toLowerCase());

        const matchLocation =
          !values.location ||
          (item.location &&
            item.location
              .toLowerCase()
              .includes(values.location.toLowerCase()));

        const itemDateTime = moment(item.dateTime);
        const matchFromDate =
          !values.fromDateTime ||
          itemDateTime.isSameOrAfter(moment(values.fromDateTime));
        const matchToDate =
          !values.toDateTime ||
          itemDateTime.isSameOrBefore(moment(values.toDateTime));

        return matchAgenda && matchLocation && matchFromDate && matchToDate;
      });

      // Prepare tag values for displaying search criteria
      const tagValues = [];
      if (values.agenda) {
        tagValues.push({
          name: ["agenda"],
          value: `Agenda: ${values.agenda}`,
        });
      }
      if (values.location) {
        tagValues.push({
          name: ["location"],
          value: `Location: ${values.location}`,
        });
      }
      if (values.fromDateTime || values.toDateTime) {
        tagValues.push({
          name: ["fromDateTime", "toDateTime"],
          value: `Date: ${
            values.fromDateTime
              ? moment(values.fromDateTime).format("MMM DD, YYYY")
              : "Any"
          } to ${
            values.toDateTime
              ? moment(values.toDateTime).format("MMM DD, YYYY")
              : "Any"
          }`,
        });
      }

      dispatch(setGetTagValues(tagValues));
      dispatch(
        getSearchData({ values: values, allData: allData, type: "Meeting" })
      );
      setSearchedData(searchResult);
      setDisplaySearchData(true);
      setAdvanceSearch(false);
      setSearchbox("");
    },
  });

  const { values, handleBlur, handleChange, handleSubmit, resetForm, dirty } =
    formik;

  return (
    <Modal
      onClose={() => {
        setAdvanceSearch(false);
        resetForm();
      }}
      isOpen={advanceSearch}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Advanced Search</ModalHeader>
        <ModalCloseButton
          onClick={() => {
            setAdvanceSearch(false);
            resetForm();
          }}
        />
        <ModalBody>
          <VStack spacing={4}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4} width="100%">
              <GridItem>
                <FormControl>
                  <FormLabel>Agenda</FormLabel>
                  <Input
                    name="agenda"
                    value={values.agenda}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Search by agenda..."
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Search by location..."
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>From Date</FormLabel>
                  <Input
                    type="datetime-local"
                    name="fromDateTime"
                    value={values.fromDateTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>To Date</FormLabel>
                  <Input
                    type="datetime-local"
                    name="toDateTime"
                    value={values.toDateTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant="brand"
            mr={2}
            onClick={handleSubmit}
            disabled={isLoding || !dirty ? true : false}
          >
            {isLoding ? <Spinner /> : "Search"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={() => resetForm()}
          >
            Clear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MeetingAdvanceSearch;
