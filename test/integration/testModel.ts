import { DataTypes } from 'sequelize';
import { BaseModelDefault } from '@flexiblepersistence/sequelize';

export default class TestModel extends BaseModelDefault {
  generateName(): void {
    this.setName('Test');
  }
  protected attributes = {
    // Model attributes are defined here
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
    },
  };

  protected options = {
    timestamps: false,
  };
}
