/**
 * @param {object} sequelize sequelize database connection instance
 * @param {object} DataTypes sequelize datatypes
 * @returns {Function} User model instance
 */
export default function User(sequelize, DataTypes) {
	return sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				unique: true,
				primaryKey: true,
				comment: 'This column is the primary unique identifier of each row in this table',
			},
			uuid: {
				type: DataTypes.UUID,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
				unique: true,
				comment: 'This column is the secondary unique identifier of each row in this table',
			},
			password: {
				type: DataTypes.STRING(128),
				allowNull: false,
				comment: 'This is a column name that has a comment',
			},
			salt: {
				type: DataTypes.STRING(128),
				allowNull: false,
				comment: 'This is a column name that has a comment',
			},
			firstName: {
				type: DataTypes.STRING(100),
				allowNull: true,
				defaultValue: null,
				comment: 'This is a column name that has a comment',
			},
			lastName: {
				type: DataTypes.STRING(100),
				allowNull: true,
				defaultValue: null,
				comment: 'This is a column name that has a comment',
			},
			phone: {
				type: DataTypes.STRING(20),
				allowNull: true,
				defaultValue: null,
				comment: 'This is phone number of user',
			},
			email: {
				type: DataTypes.STRING(60),
				allowNull: true,
				defaultValue: null,
				comment: 'This is email of user',
			},
			organizationName: {
				type: DataTypes.STRING(100),
				allowNull: true,
				defaultValue: null,
				comment: 'This column is used for organization name of user.',
			},
			organizationPhone: {
				type: DataTypes.STRING(20),
				allowNull: true,
				defaultValue: null,
				comment: 'This column is used for organization phone no of user.',
			},
			organizationEmail: {
				type: DataTypes.STRING(60),
				allowNull: true,
				defaultValue: null,
				comment: 'This column is used for organization email of user.',
			},
		},
		{
			comment: "I'm a table comment!",
			underscored: true,
			schema: 'public',
			tableName: 'users',
		},
	);
}
