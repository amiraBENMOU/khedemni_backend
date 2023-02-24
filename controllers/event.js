import { StatusCodes } from "http-status-codes";
import { BadRequestErrorAPI, NotFoundErrorAPI } from "../utils/errorAPI";
import { deleteImage, updateImage, uploadImage } from "../utils/image";
import Event from "../models/Event";

/************************** SUPER ADMIN | EVENT RESPONSIBLE ********************************/
export const createEvent = async (req, res) => {
  const { name, description, location } = req.body;

  const userAuthor = req.user.userID;

  const image = req?.files?.image;
  const uploadedImage = await uploadImage(image, "aiesec/events");

  if (!name || !description || !location) {
    throw new BadRequestErrorAPI("Please provide all values");
  }

  const event = await Event.create({
    name,
    description,
    location,
    image: uploadedImage?.secure_url,
    userAuthor,
  });

  res.status(StatusCodes.CREATED).json(event);
};

export const getEvents = async (req, res) => {
  const events = await Event.find(req.query);
  res.status(StatusCodes.OK).json(events);
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  res.status(StatusCodes.OK).json(event);
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  const { name, description, location } = req.body;

  if (req.files) {
    const { image } = req.files;
    const event = await Event.findById(id);
    const updatedImage = await updateImage(image, event.image, "aiesec/events");
    await Event.findByIdAndUpdate(id, { image: updatedImage.secure_url });
  }

  const event = await Event.findByIdAndUpdate(
    id,
    {
      name,
      description,
      location,
    },
    { new: true }
  );

  res.status(StatusCodes.OK).json(event);
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  const event = await Event.findByIdAndDelete(id);
  if (!event) {
    throw new NotFoundErrorAPI("Event not found");
  }

  await deleteImage(event.image, "aiesec/events");

  res
    .status(StatusCodes.OK)
    .json({ message: `Event ${event.name} deleted with success.` });
};
