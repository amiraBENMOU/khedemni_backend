import { Schema, model } from "mongoose";


const ourRecrutmentSchema = new Schema({
  positionTitle: {
    type: String,
    required: [true, " The  Title of the position is required"],
  },
  positionType: {
    type: String,
    required: [true, "The Title of the position is required"],
    enum: {
      values: ["part time", "full time", "hybrid", "remote"],
      message: "Position type must be one of :  'part time', 'full time', 'hybrid', 'remote'",
    },
  },
  Domain: {
    type: String,
    required: [true, "The Domaine of the position is required"],
    enum: {
      values: ["Vente,Televente,Assistante", "Commercial,Techno Commercial,Service Client ",
                "Responsable Commercial,Grands Comptes", "Creation,Design,Graphisme", "Marketing,Communication,Media",
                "Informatique,Telecom,Internet", "Comptabilite,Finance,Gestion", "Secretariat,Bureau,Administration",
              ],
      message: "Position type must be one of the ones we have in the list",
    },
  },
  DescriptionOfThePosition: {
    type: String,
    required: [true, " The  description is required"],
  },
  typeOfContract: {
    type: String,
    required: [true, "The Type of the Contract is required"],
    enum: {
      values: ["CDI", "CDD", "freelnce"],
      message: "Position type must be one of the onces we have in the list",
    },
  },
  numberOfPepeol: {
    type: Number,
    required: [true, " The  number is required"],
  },
  
 
  
});

export default model("Company", companySchema);
