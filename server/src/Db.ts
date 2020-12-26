import { DataTypes, Sequelize, Model } from "sequelize";

import { SecretSantaList } from "./SecretSantaList";

const sequelize = new Sequelize(
  <string>process.env.DB_DBNAME,
  <string>process.env.DB_USERNAME,
  <string>process.env.DB_PASSWORD,
  {
    host: <string>process.env.DB_HOST,
		dialect: "postgres",
		logging: () => {}
  }
);

// ----- Classes -----

export class List extends Model {
  public readonly id!: number;
  public readonly max_participants!: number;
  public readonly scrambled!: boolean;
  public readonly date_created!: Date;

  async scramble() {
    try {
      const participants = await this.getParticipants();
      if (participants.length < 3) { // List too short
        throw new Error(
          "The list is too short, it must be of length 3 at least"
        );
      } else {
				const secretSantaList = new SecretSantaList<Participant>(participants);
				secretSantaList.scramble();
				if(secretSantaList.isCompleted()) {
					await Promise.all(participants.map(participant => Association.create({gifter_id: participant.id, receiver_id: secretSantaList.getRecipient(participant)?.id})));
					return this.update({scrambled: true});
				}
      }
    } catch (err) {
			throw err;
		}
  }

  async getParticipants() {
    try {
      return await Participant.findAll({ where: { list_id: this.id } });
    } catch (err) {
      throw err;
    }
  }

  async getAssociations() {
    try {
      const participants = await this.getParticipants();
      return await Association.findAll({
        where: { gifter_id: participants.map((participant) => participant.id) },
      });
    } catch (err) {
      throw err;
    }
  }
}

export class Participant extends Model {
  public readonly id!: number;
  public email!: string;
  public name!: string;
  public readonly date_added!: Date;
  public readonly creator!: boolean;
  public readonly list_id!: number;

  async associate(receiver: Participant) {
    try {
      return Association.create({
        gifter_id: this.id,
        receiver_id: receiver.id,
      });
    } catch (err) {
      throw err;
    }
  }
}

export class Association extends Model {
  public readonly id!: number;
  public readonly gifter_id!: number;
  public readonly receiver_id!: number;
  public readonly date_created!: Date;
}

// ----- Models -----

List.init(
  {
    id: {
      unique: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    max_participants: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 8,
    },
    scrambled: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    tableName: "list",
    timestamps: false,
  }
);

Participant.init(
  {
    id: {
      unique: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    date_added: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    creator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    list_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: List,
        key: "id",
      },
    },
  },
  {
    sequelize: sequelize,
    tableName: "participant",
    timestamps: false,
  }
);

Association.init(
  {
    id: {
      unique: true,
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gifter_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Participant,
        key: "id",
      },
    },
    receiver_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Participant,
        key: "id",
      },
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize,
    tableName: "association",
    timestamps: false,
  }
);

// Sync the models
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(`Sequelize synced successfully! 🖇`);
  })
  .catch((err) => {
    console.error(`Error while trying to sync sequelize. ❕`, err);
  });
