import mongoose from 'mongoose';

// P3: async lots (live video plugs in P4 via Livekit). Escrow mock: order created on close.
const showSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80, index: true },
    seller: { type: String, required: true, trim: true, maxlength: 40 },
    category: { type: String, enum: ['sneakers', 'cards', 'thrift', 'coins'], default: 'sneakers', index: true },
    live: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const lotSchema = new mongoose.Schema(
  {
    showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', index: true },
    label: { type: String, required: true, trim: true, maxlength: 80 },
    startPrice: { type: Number, required: true, min: 1, max: 500000 },
    topBid: { type: Number, default: 0 },
    topBidder: { type: String, default: '' },
    closed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const bidSchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', index: true },
    bidder: { type: String, required: true, trim: true, maxlength: 40 },
    amount: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    lotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lot', index: true },
    winner: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ['escrow', 'shipped', 'done'], default: 'escrow' },
  },
  { timestamps: true }
);

export const Show = mongoose.models.Show || mongoose.model('Show', showSchema);
export const Lot = mongoose.models.Lot || mongoose.model('Lot', lotSchema);
export const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
