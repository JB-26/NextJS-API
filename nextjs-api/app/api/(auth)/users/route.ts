import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { Types } from "mongoose";

// to check if the ID is valid
//const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    // connect to the DB
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error in fetching users ${error}`, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    // connect to the DB
    await connect();
    // create a new instance of User
    const newUser = new User(body);
    // save it to DB
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User created successfully", user: newUser }),
      { status: 201 },
    );
  } catch (error) {
    return new NextResponse(`Error creating user ${error}`, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    // destructuring
    const { userId, newUsername } = body;

    // connect to the DB
    await connect();
    // check if the userId and newUsername does not exist
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or new username not found" }),
        { status: 400 },
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { username: newUsername },
      { new: true },
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found", user: updatedUser }),
        {
          status: 404,
        },
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updatedUser }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: `Error in updating user ${error}` }),
      { status: 500 },
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
      });
    }

    // connect to the DB
    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId),
    );

    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User has been deleted", user: deletedUser }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: `Error in deleting user ${error}` }),
      { status: 500 },
    );
  }
};
