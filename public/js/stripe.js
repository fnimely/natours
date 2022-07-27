import axios from "axios";
import { showAlert } from "./alert";

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51LPrLtKplla0gXkNUWY8cyPb3aKbk90Hywp9HOIioHMjADc06FMfoa1lIcdmPI9Wif4tVYXeiZALtX3reLVPnsXd00xOECpz3t"
  );
  try {
    // get the session from server
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
