/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const SECRET_STRIPE_KEY = '';
const stripe = new Stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2022-11-15'
});

// localhost:5173/api/stripeCheckout
// POST /stripeCheckout data: items
// return -> url created by Stripe for our user to use

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const items = data.items;
	const lineItems: any = [];
	items.forEach((item: any) => {
		lineItems.push({ price: item.price, quantity: item.quantity });
	});
	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		success_url: 'http://localhost:5173/success',
		cancel_url: 'http://localhost:5173/cancel'
	});
	return new Response(
		JSON.stringify({
			url: session.url
		})
	);
};
