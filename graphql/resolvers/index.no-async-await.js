const bcrypt = require('bcryptjs');
const Event = require('../../models/event'); // Mongo Store Event
const User = require('../../models/user'); // Mongo Store User

const events = eventIds => {
	return Event.find({ _id: { $in: eventIds } })
		.then(events => {
			return events.map(event => {
				return { 
					...event._doc, 
					_id: event.id, 
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, event.creator)
				};
			});
		})
		.catch(err => {
			throw err;
		})
}

const user = userId => {
	return User.findById(userId)
		.then(user => {
			return { 
				...user._doc, 
				_id: user.id,
				createdEvents: events.bind(this, user._doc.createdEvents)
			};
		})
		.catch(err => {
			throw err;
		})
}

module.exports = {
	events: () => {
		return Event.find()
			// .populate('creator') // User manual aroow function instead (User)
			.then(events => {
				return events.map(event => {
					// return { ...event._doc, _id: event._doc._id.toString() }; // run ok
					return { 
						...event._doc, 
						_id: event.id,
						// creator: { // Use with populate
						// 	...event._doc.creator._doc,
						// 	_id: event._doc.creator.id
						// } 
						creator: user.bind(this, event._doc.creator)
					}; // run ok
				});
			})
			.catch(err => {
				throw err;
			})
	},
	createEvent: (args) => {
		// const event = {
		// 	_id: Math.random().toString(),
		// 	title: args.eventInput.title,
		// 	description: args.eventInput.description,
		// 	price: +args.eventInput.price,
		// 	date: new Date().toISOString()
		// };

		const event = new Event({
			title: args.eventInput.title,
			description: args.eventInput.description,
			price: +args.eventInput.price,
			date: new Date(args.eventInput.date),
			creator: '5c1e4a47dc31442d00b1bcea'
		});

		// console.log(event); // verify if error
		// console.log(args); // verify if error
		// events.push(event);
		let createdEvent;
		return event
			.save()
			.then(result => {
				createdEvent = { 
					...event._doc, 
					_id: event._doc._id.toString(),
					date: new Date(event._doc.date).toISOString(),
					creator: user.bind(this, result._doc.creator) 
				};
				return User.findById('5c1e4a47dc31442d00b1bcea');
			})
			.then(user => {
				if (!user) {
					throw new Error('User not found!')
				}
				user.createdEvents.push(event);
				return user.save();
			})
			.then(result => {
				// console.log(result);
				return createdEvent;
			})
			.catch(err => {
				console.log(err);
				throw err;
			})
		// return event;
	},
	createUser: args => {
		return User.findOne({ email: args.userInput.email })
			.then(user => {
				if (user) {
					throw new Error('User exists already!')
				}
				return bcrypt.hash(args.userInput.password, 12)
			})
			.then(hashedPassword => {
				const user = new User({
					email: args.userInput.email,
					password: hashedPassword
				})
				return user.save();
			})
			.then(result => {
				return { ...result._doc, password: null, _id: result.id }
			})
			.catch(err => {
				throw err
			})
		
	}
}