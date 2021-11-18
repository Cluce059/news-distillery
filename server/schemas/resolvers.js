const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password')
                .populate('savedArticles')
      
              return userData;
            }
      
            throw new AuthenticationError('Not logged in');
          },
          users: async () => {
            return User.find()
              .select('-__v -password')
              .populate('savedArticles');
          }
    },
    Mutation: {
        addUser: async (parents, args ) => {
            const user = await User.create(args);
            const token = signToken(user);
            return {token ,user};
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
          },

          saveArticle: async(parent, {input}, {user}) => {
            //console.log(args.input)
            //if user is session
             if(user){
                 const updatedUser = await User.findByIdAndUpdate(
                     {_id: context.user._id},     
                     {$addToSet: { savedArticles: input } },
                     { new: true, runValidators: true }
                 )
                 //
                 return updatedUser;
             }
             throw new AuthenticationError('You need to be logged in!');
           },
           
            removeArticle:async(parent, args, context) => {
                 if(context.user){
                     const updatedUser = await User.findOneAndUpdate(
                         {_id: context.user._id },
                         {$pull: {savedArticles: { articlesId: args.articleId }}},
                         {new: true }
                     );
                     return updatedUser;
                 }
                 throw new AuthenticationError('You need to be logged in!');
            }

    }
};

module.exports = resolvers;