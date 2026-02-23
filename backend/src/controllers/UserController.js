const userRepository = require('../repositories/UserRepository');

class UserController {
    async search(req, res, next) {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: 'Query parameter "id" is required' });
            }

            const users = await userRepository.searchById(id);
            return res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req, res, next) {
        try {
            const { displayName, bio } = req.body;
            const userId = req.user.userId; // From authMiddleware

            const updatedUser = await userRepository.updateProfile(userId, { displayName, bio });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Exclude passwordHash from response
            const responseData = {
                _id: updatedUser._id,
                email: updatedUser.email,
                displayName: updatedUser.displayName,
                bio: updatedUser.bio,
                isVerified: updatedUser.isVerified,
            };

            return res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
