import { Request, Response } from "express";
import { status } from "../utils/statusEnums";
import authModel from "../model/authModel";
import studioModel from "../model/studioModel";
import { Types } from "mongoose";
import { multiStreamifier, streamUpload } from "../utils/streamifier";
import axios from "axios";
import activityModel from "../model/activityModel";

export const createStudio = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const {
      studioContact,
      studioCategory,
      studioAddress,
      studioDescription,
      studioFeatures,
      studioPrice,
      numberOfGuess,
      discountPercent,
      studioName,
      studioPriceDaily,
      // includeDiscount,
    } = req.body;

    const account = await authModel.findById(accountID);

    // const options = {
    //   method: "GET",
    //   params: {
    //     address: studioAddress,
    //   },
    //   headers: {
    //     "x-rapidapi-key": "02dc23aea7msh5cc3022c747fdd7p160805jsn1378c2b79155",
    //     "x-rapidapi-host": "address-from-to-latitude-longitude.p.rapidapi.com",
    //   },
    // };

    // const location = await axios
    //   .get(
    //     `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi`,
    //     options
    //   )
    //   .then((res: any | {}) => {
    //     console.log(res.data.Results[0]);
    //     return res?.data?.Results[0];
    //   });

    const apiKey = "pk.2f2af94b99b88d7bd8e3b3d1fdb89bb0";

    const getCoordinates = async (
      address: string
    ): Promise<
      | {
          lat: any;
          long: any;
        }
      | undefined
    > => {
      const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(
        address
      )}&format=json`;

      try {
        const response = await axios.get(url);
        const location = response.data[0]; // get first result
        console.log("Latitude:", location.lat);
        console.log("Longitude:", location.lon);
        return { lat: location.lat, long: location.lon };
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    let x: any = await getCoordinates(studioAddress);

    if (account) {
      const studio = await studioModel.create({
        accountHolderID: account?._id,
        studioContact,
        studioCategory,
        studioAddress,
        latitude: x.lat,
        longitude: x.long,
        studioLat: {
          latitude: x.lat,
          longitude: x.long,
        },
        studioDescription,
        studioFeatures,
        studioImages: await multiStreamifier(req),
        studioPrice,
        studioPriceDaily,
        numberOfGuess,
        includeDiscount: true,
        discountPercent,
        studioName,
      });

      await activityModel.create({
        action: `A New Booking Action`,
        actionDetail: `${account?.firstName} ${account?.lastName} just listed a new studio named: ${studio?.studioName}`,
        actionInfo: `This is to Notify you that a new studio ${studio?.studioName} has been added to collections of studios`,
        actionType: "Studio Listing",
      });

      account.studio.push(new Types.ObjectId(studio._id));
      account.save();

      return res.status(status.OK).json({
        message: `studio has been added`,
        data: studio,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAccountStudio = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const account = await studioModel.findById(accountID);

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAccountStudioHistory = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const account = await studioModel.findById(accountID).populate({
      path: "history",
    });

    console.log(account);

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewUserStudios = async (req: Request, res: Response) => {
  try {
    const { accountID } = req.params;
    const account = await authModel.findById(accountID).populate({
      path: "studio",
      options: {
        createdAt: -1,
      },
    });

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAccountStudioByName = async (req: Request, res: Response) => {
  try {
    const { studioName } = req.params;
    const account = await studioModel.findOne({ studioName });

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const viewAllStudio = async (req: Request, res: Response) => {
  try {
    const account = await studioModel.find().sort({ createdAt: -1 });

    return res.status(status.OK).json({
      message: `viewing studio`,
      data: account,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const updateStudioInfo = async (req: any, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { studioDescription } = req.body;

    const account = await authModel.findById(accountID);
    const studio = await studioModel.findById(studioID);

    if (account && studio) {
      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioDescription: studioDescription,
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio description has been updated`,
        data: imagesAdded,
        status: 201,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const addStudioImages = async (req: any, res: Response) => {
  try {
    const { accountID, studioID } = req.params;

    const account = await authModel.findById(accountID);
    const studio = await studioModel.findById(studioID);
    // const { secure_url }: any = await streamUpload(req);

    if (account && studio) {
      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages:
            // [...studio.studioImages, secure_url],
            [...studio.studioImages, ...(await multiStreamifier(req))],
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio images has been added`,
        data: imagesAdded,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const removeStudioImages = async (req: any, res: Response) => {
  try {
    const { accountID, studioID } = req.params;
    const { i } = req.body;

    const account = await authModel.findById(accountID);
    const studio = await studioModel.findById(studioID);

    if (account && studio) {
      let newImage: any = studio.studioImages.filter((el: any) => el !== i);

      let imagesAdded = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages: newImage,
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio images has been added`,
        data: imagesAdded,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const searchStudio = async (req: Request, res: Response) => {
  try {
    const { studioCategory } = req.body;

    if (studioCategory === "All") {
      const account = await studioModel.find();

      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    } else {
      const account = await studioModel.find({ studioCategory });

      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const editAccountStudioInfo = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const {
      studioName,
      studioPrice,
      studioPriceDaily,
      studioAddress,
      studioDescription,
      discountPercent,
    } = req.body;
    const user = await authModel.findById(userID);

    if (user) {
      // const options = {
      //   method: "GET",
      //   params: {
      //     address: studioAddress,
      //   },
      //   headers: {
      //     "x-rapidapi-key":
      //       "02dc23aea7msh5cc3022c747fdd7p160805jsn1378c2b79155",
      //     "x-rapidapi-host":
      //       "address-from-to-latitude-longitude.p.rapidapi.com",
      //   },
      // };

      // const location = await axios
      //   .get(
      //     `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi`,
      //     options
      //   )
      //   .then((res: any | {}) => {
      //     console.log(res.data.Results[0]);
      //     return res?.data?.Results[0];
      //   });

      const apiKey = "pk.2f2af94b99b88d7bd8e3b3d1fdb89bb0";

      const getCoordinates = async (
        address: string
      ): Promise<
        | {
            lat: any;
            long: any;
          }
        | undefined
      > => {
        const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(
          address
        )}&format=json`;

        try {
          const response = await axios.get(url);
          const location = response.data[0]; // get first result
          console.log("Latitude:", location.lat);
          console.log("Longitude:", location.lon);
          return { lat: location.lat, long: location.lon };
        } catch (error) {
          console.error("Error fetching coordinates:", error);
        }
      };

      let x: any = await getCoordinates(studioAddress);

      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioName,
          latitude: x.lat,
          longitude: x.long,
          studioLat: {
            latitude: x.lat,
            longitude: x.long,
          },
          studioPrice,
          studioPriceDaily,
          studioAddress,
          studioDescription,
          discountPercent,
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const deleteAccountStudioFeature = async (
  req: Request,
  res: Response
) => {
  try {
    const { userID, studioID } = req.params;
    const { featureName } = req.body;
    const user = await authModel.findById(userID);
    const studio: any = await studioModel.findById(studioID);

    const y = studio.studioFeatures[0].split(",");
    const m = y.filter((el: string) => el !== featureName);

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioFeatures: [m.join(",")],
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const addAccountStudioFeature = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const { featureName } = req.body;
    const user = await authModel.findById(userID);
    const studio: any = await studioModel.findById(studioID);

    const y = studio.studioFeatures[0].split(",");

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioFeatures: [[...featureName].join(",")],
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const deleteStudio = async (req: Request, res: Response) => {
  try {
    const { accountID, studioID } = req.params;

    const account: any = await authModel.findById(accountID);

    if (account) {
      account?.studio?.pull(new Types.ObjectId(studioID));
      account.save();

      return res.status(status.OK).json({
        message: `studio has been delete`,
      });
    } else {
      return res.status(status.BAD).json({
        message: "Account can't be found",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const blockStudio = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const { imageURL } = req.body;
    const user = await authModel.findById(userID);
    const studio: any = await studioModel.findById(studioID);

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          block: true,
        },
        { new: true }
      );

      return res.status(status.OK).json({
        message: `studio has be closed`,
        data: account,
        status: 201,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const banStudio = async (req: Request, res: Response) => {
  try {
    const { studioID } = req.params;
    const { imageURL } = req.body;

    const studio: any = await studioModel.findById(studioID);

    const account = await studioModel.findByIdAndUpdate(
      studioID,
      {
        block: true,
        ban: true,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: `studio has be closed`,
      data: account,
      status: 201,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const unbanStudio = async (req: Request, res: Response) => {
  try {
    const { studioID } = req.params;
    const { imageURL } = req.body;

    const studio: any = await studioModel.findById(studioID);

    const account = await studioModel.findByIdAndUpdate(
      studioID,
      {
        block: false,
        ban: false,
      },
      { new: true }
    );

    return res.status(status.OK).json({
      message: `studio has be closed`,
      data: account,
      status: 201,
    });
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const openStudio = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;

    const user = await authModel.findById(userID);
    const studio: any = await studioModel.findById(studioID);

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          block: false,
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `studio is open`,
        data: account,
        status: 201,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};

export const deleteAccountStudioImage = async (req: Request, res: Response) => {
  try {
    const { userID, studioID } = req.params;
    const { imageURL } = req.body;
    const user = await authModel.findById(userID);
    const studio: any = await studioModel.findById(studioID);

    if (user) {
      const account = await studioModel.findByIdAndUpdate(
        studioID,
        {
          studioImages: studio.studioImages.filter(
            (el: string) => el !== imageURL
          ),
        },
        { new: true }
      );
      return res.status(status.OK).json({
        message: `viewing studio`,
        data: account,
        status: 201,
      });
    } else {
      return res.status(status.BAD).json({
        message: "error with userID",
      });
    }
  } catch (error: any) {
    return res.status(status.BAD).json({
      message: error.message,
    });
  }
};
