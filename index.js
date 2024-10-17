import { ApolloServer } from '@apollo/server'; // preserve-line
import { startStandaloneServer } from '@apollo/server/standalone'; // preserve-line
import {typeDefs} from './schema.js';
import {games, reviews, authors} from './_db.js';

const resolvers = {
    // creating a query type resolver
    // Match the type name
    Query: {
        games() {
            return games
        },
        reviews() {
            return reviews
        },
        authors() {
            return authors
        },
        // parent-- in resolver chain-- nested queries, args , context-- such authentication
        review(_, args) {
            return reviews.find(review => review.id === args.id);
            
        },
        game(_, args){
            return games.find(game => game.id === args.id);
        },
        author(_, args){
            return authors.find(author => author.id === args.id);
        }
    },
    Game: {
        reviews(parent){
            return reviews.filter(review => review.game_id === parent.id);
        }
    },
    Author: {
        reviews(parent) {
            return reviews.filter(review => review.author_id === parent.id);
        }
    },
    Review: {
        author(parent) {
            return authors.find(author => author.id === parent.author_id);
        },
        game(parent){
            return games.find(game => game.id === parent.game_id);
        }
    },
    Mutation: {
        deleteGame(_, args){
           const index = games.findIndex(game => game.id === args.id);

           if(index === -1){
               return null;
           }
           const deletedGame = games[index];
           return deletedGame;
        },
        addGame(_, args){
            let game = {
                ...args.game,
                id: Math.floor(Math.random()  * 10000).toString()
            }
            games.push(game);
            return game;
        },
        updateGame(_, args) {
            const index = games.findIndex(game => game.id === args.id);
            if(index === -1 ) {
                return games;
            }
            games[index] = {
                ...games[index],
                ...args.edits
            }
            console.log(games);
            return games[index];
        }

    }
}

const startServer = async () => {

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000}
});

console.log(`Server ready at ${url} at port 4000`);

};

startServer();