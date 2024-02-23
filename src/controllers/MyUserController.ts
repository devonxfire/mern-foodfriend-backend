import { Request, Response } from "express";
import User from "../models/user.model";

// Create a new user
const createCurrentUser = async (req: Request, res: Response) => {
  try {
    // Extracting auth0Id from the request body
    const { auth0Id } = req.body;

    // Checking if a user with the provided auth0Id already exists in the database
    const existingUser = await User.findOne({ auth0Id });

    // If user exists, return success status without creating a new user
    if (existingUser) {
      return res.status(200).send();
    }

    // If user doesn't exist, create a new user using the User model
    const newUser = new User(req.body);

    // Saving the new user to the database
    await newUser.save();

    // Returning a success status along with the newly created user details
    res.status(201).json(newUser.toObject());
  } catch (error) {
    // Handling errors and logging them
    console.log(error);

    // Returning an internal server error status and message
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();

    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUser = await User.findOne({ _id: req.userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default { createCurrentUser, updateCurrentUser, getCurrentUser };
