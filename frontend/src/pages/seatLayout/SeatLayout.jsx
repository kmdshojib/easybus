import { Button, Checkbox, Grid } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Zoom from "@mui/material/Zoom";
import React from "react";
import ChairIcon from "@mui/icons-material/Chair";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useGetAllSeatQuery } from "../../features/bus/busSlice";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.secondary.main,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.secondary.main,
    width: "50px",
    height: "30px",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
  },
}));
const SeatLayout = ({ booking, dateInSearch }) => {
  const { setBookedSeats, bookedseats, setBookedBus, journeyDate, bookedBus } =
    useContext(DataContext);
  const [booked, setBooked] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateSeat = (seatInfo) => {
    return axios.patch(
      "https://easybus-backend.vercel.app/api/v1/bus/update",
      seatInfo
    );
  };
  const { mutate } = useMutation(updateSeat, {
    onSuccess: () => {
      queryClient.invalidateQueries(["buses"]);
      // setBooked(false);
    },
  });
  const { seats, _id } = booking;
  const getBookedSeat = (seat) => {
    const bookCheck = seat.seatAvailability?.find(
      (item) => item?.bookingDate === journeyDate
    );
    if (!bookCheck) {
      mutate({ busId: _id, seatNo: seat.seatNo });
    } else {
      toast.error("This seat is already booked");
    }
    console.log(seat.tempBooked);

    const bookSeat = booking.seats.filter((each) => each.tempBooked === true);
    if (!seat.tempBooked === true) {
      console.log(bookSeat);
      setBooked(false);
      const newSeats = [...bookedseats, seat.seatNo];
      let removeDuplicateSeats = newSeats.filter(
        (v, i) => newSeats.indexOf(v) === i
      );
      setBookedSeats(removeDuplicateSeats);
    } else {
      const newSeats = [...bookedseats, seat.seatNo];
      let removeDuplicateSeats = newSeats.filter(
        (v, i) => newSeats.indexOf(v) === i
      );
      let removeCurrent = removeDuplicateSeats.filter(
        (each) => each !== seat.seatNo
      );
      console.log(removeCurrent, "r");
      setBookedSeats(removeCurrent);
      setBooked(true);
    }
    if (bookSeat.length > 1) {
      setBooked(false);
    }
    // if (bookSeat.length > 3) {
    //   return toast("You Can Select atleast 3 sit");
    // }
    // const newSeats = [...bookedseats, seat.seatNo];
    // let removeDuplicateSeats = newSeats.filter(
    //   (v, i) => newSeats.indexOf(v) === i
    // );
    // setBookedSeats(removeDuplicateSeats);
    setBookedBus(booking);
    // toast(seat.seatNo);
  };

  // temporary booking reset
  const handleBookingReset = () => {
    fetch("https://easybus-backend.vercel.app/api/v1/bus/reset", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seatNo: bookedseats, busId: bookedBus._id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/payment");
        }
      });
  };
  return (
    <Box>
      <Stack
        width={220}
        border={"2px solid #ccc"}
        padding={1}
        paddingY={2}
        borderRadius={1}
        key={Math.random()}
      >
        <Box className="driver-seat" textAlign={"right"}>
          <Box
            marginBottom={1}
            marginRight={1}
            sx={{ filter: "contrast(20%)" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/950/950497.png"
              alt=""
              width={"25px"}
            />
          </Box>
        </Box>

        <Stack direction={"row"} spacing={5}>
          <Box>
            <Grid container columns={{ xs: 12 }} spacing={1}>
              {seats?.slice(0, 12).map((seat) => (
                <Grid item xs={6} key={Math.random()}>
                  <BootstrapTooltip
                    TransitionComponent={Zoom}
                    title={seat.seatNo}
                    arrow
                    placement="top"
                  >
                    <Checkbox
                      onClick={() => getBookedSeat(seat)}
                      {...label}
                      icon={<ChairOutlinedIcon sx={{ color: "#999" }} />}
                      checkedIcon={<ChairIcon />}
                      checked={
                        seat.seatAvailability?.find(
                          (item) => item?.bookingDate === dateInSearch
                        ) || seat.tempBooked
                      }
                    />
                  </BootstrapTooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box>
            <Grid container columns={{ xs: 12 }} spacing={1}>
              {seats?.slice(12, 24).map((seat) => (
                <Grid item xs={6} key={Math.random()}>
                  <BootstrapTooltip
                    TransitionComponent={Zoom}
                    title={seat.seatNo}
                    arrow
                    placement="top"
                  >
                    <Checkbox
                      onClick={() => getBookedSeat(seat)}
                      {...label}
                      icon={<ChairOutlinedIcon sx={{ color: "#999" }} />}
                      checkedIcon={<ChairIcon />}
                      checked={
                        seat.seatAvailability?.find(
                          (item) => item?.bookingDate === dateInSearch
                        ) || seat.tempBooked
                      }
                    />
                  </BootstrapTooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
        <Button
          component={Link}
          sx={{
            backgroundColor: "#089D49",
            color: "white",
            fontSize: "12px",
            mt: "40px",
            ":hover": {
              background: "#000000",
              transition: "all 0.5s",
            },
          }}
          onClick={handleBookingReset}
          disabled={booked}
        >
          Cofirm Booking
        </Button>
      </Stack>
    </Box>
  );
};

export default SeatLayout;
