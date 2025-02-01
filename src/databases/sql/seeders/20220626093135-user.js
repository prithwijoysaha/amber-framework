/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-vars */

/**
 *
 * @param queryInterface
 * @param Sequelize
 */

export async function up(queryInterface, Sequelize) {
	/**
	 * Add seed commands here.
	 *
	 * Example:
	 * await queryInterface.bulkInsert('People', [{
	 *   name: 'John Doe',
	 *   isBetaMember: false
	 * }], {});
	 */
	return queryInterface.bulkInsert('users', [
		{
			firstName: 'John',
			lastName: 'Doe',
			email: 'example@example.com',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	]);
}
// eslint-disable-next-line no-unused-vars
/**
 *
 * @param queryInterface
 * @param Sequelize
 */
// eslint-disable-next-line no-unused-vars
export async function down(queryInterface, Sequelize) {
	/**
	 * Add commands to revert seed here.
	 *
	 * Example:
	 * await queryInterface.bulkDelete('People', null, {});
	 */
	return queryInterface.bulkDelete('users', null, {});
}
