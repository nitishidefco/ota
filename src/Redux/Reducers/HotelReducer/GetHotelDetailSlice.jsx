import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getHotelDetails} from '../../../Services/HotelService.js/GetHotelDetails';
import {getAdditionalDetails} from '../../../Services/HotelService.js/GetAdditionalDetailsService';

const initialState = {
  hotel: null,
  loadingHotels: null,
  additionalDetails: {
    status: true,
    result: {
      address: 'Al Meena Street, Abu Dhabi United Arab Emirates',
      total_reviews: '175',
      rating: '3.3',
      review_rating_count: {1: '23', 2: '30', 3: '34', 4: '53', 5: '35'},
      reviews: [
        {
          id: 994978985,
          lang: 'en',
          location_id: 580602,
          published_date: '2025-02-22T11:00:40Z',
          rating: 1,
          helpful_votes: 0,
          rating_image_url:
            'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
          url: 'https://www.tripadvisor.com/ShowUserReviews-g294013-d580602-r994978985-Reviews-Al_Diar_Mina_Hotel-Abu_Dhabi_Emirate_of_Abu_Dhabi.html?m=66827#review994978985',
          text: "Horrible experience very dirty hotel \nReception is Horrible \nParking is available to the public but they demanding you pay for them\nThey park a car of one of the employees in the paid public parking and when you request parking you pay him for moving his car out of the parking \nThey don't have respect for disability person \n",
          title: 'Horrible ',
          trip_type: 'Friends getaway',
          travel_date: '2025-02-28',
          user: {
            username: 'noudiiin',
            user_location: {id: 'null'},
            avatar: {
              thumbnail:
                'https://media-cdn.tripadvisor.com/media/photo-t/1a/f6/f3/23/default-avatar-2020-28.jpg',
              small:
                'https://media-cdn.tripadvisor.com/media/photo-l/1a/f6/f3/23/default-avatar-2020-28.jpg',
              medium:
                'https://media-cdn.tripadvisor.com/media/photo-f/1a/f6/f3/23/default-avatar-2020-28.jpg',
              large:
                'https://media-cdn.tripadvisor.com/media/photo-p/1a/f6/f3/23/default-avatar-2020-28.jpg',
              original:
                'https://media-cdn.tripadvisor.com/media/photo-o/1a/f6/f3/23/default-avatar-2020-28.jpg',
            },
          },
          subratings: {},
        },
        {
          id: 970621009,
          lang: 'en',
          location_id: 580602,
          published_date: '2024-09-20T17:54:21Z',
          rating: 1,
          helpful_votes: 1,
          rating_image_url:
            'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
          url: 'https://www.tripadvisor.com/ShowUserReviews-g294013-d580602-r970621009-Reviews-Al_Diar_Mina_Hotel-Abu_Dhabi_Emirate_of_Abu_Dhabi.html?m=66827#review970621009',
          text: 'Very noisy hotel \nOrdered fruit salad not available so just checked out and went elsewhere \nWaste of money very poor  I will never go there again check out at 1 am they didn’t even ask why \nLike they didn’t even care or ask why I  checked out. Just handed in the card and left',
          title: 'One off the worst hotels in Abu Dhabi',
          trip_type: 'Business',
          travel_date: '2024-08-31',
          user: {
            username: 'pauleA3626UW',
            user_location: {id: '1811027', name: 'Auckland, North Island'},
            avatar: {
              thumbnail:
                'https://media-cdn.tripadvisor.com/media/photo-t/1a/f6/e8/ea/default-avatar-2020-63.jpg',
              small:
                'https://media-cdn.tripadvisor.com/media/photo-l/1a/f6/e8/ea/default-avatar-2020-63.jpg',
              medium:
                'https://media-cdn.tripadvisor.com/media/photo-f/1a/f6/e8/ea/default-avatar-2020-63.jpg',
              large:
                'https://media-cdn.tripadvisor.com/media/photo-p/1a/f6/e8/ea/default-avatar-2020-63.jpg',
              original:
                'https://media-cdn.tripadvisor.com/media/photo-o/1a/f6/e8/ea/default-avatar-2020-63.jpg',
            },
          },
          subratings: {
            0: {
              name: 'RATE_VALUE',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
              value: 1,
              localized_name: 'Value',
            },
            1: {
              name: 'RATE_ROOM',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
              value: 1,
              localized_name: 'Rooms',
            },
            2: {
              name: 'RATE_LOCATION',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s5.0-66827-5.svg',
              value: 5,
              localized_name: 'Location',
            },
            3: {
              name: 'RATE_CLEANLINESS',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s2.0-66827-5.svg',
              value: 2,
              localized_name: 'Cleanliness',
            },
            4: {
              name: 'RATE_SERVICE',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
              value: 1,
              localized_name: 'Service',
            },
          },
        },
        {
          id: 936561746,
          lang: 'en',
          location_id: 580602,
          published_date: '2024-02-01T20:39:49Z',
          rating: 1,
          helpful_votes: 2,
          rating_image_url:
            'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
          url: 'https://www.tripadvisor.com/ShowUserReviews-g294013-d580602-r936561746-Reviews-Al_Diar_Mina_Hotel-Abu_Dhabi_Emirate_of_Abu_Dhabi.html?m=66827#review936561746',
          text: 'On my first visit to the club with my friend, we were thoroughly enjoying the music as it was in our native language. However, towards the end of the night, my friend requested a song to wish me luck. To our great surprise, the club staff brought out champagne, which was accompanied by fireworks. The fireworks display was impressive, but to our dismay, we were later charged a hefty amount for it. We never gave our permission for any of this. To add to our disappointment, while the club staff was handling my friend\'s necklace, they pulled it so hard that it broke. Despite this, they refused to take responsibility for damaging it and shrugged it off as "not their responsibility". So, if you plan on going to this club, be alert and careful to avoid any such surprises.',
          title: 'Disappointed experience ',
          trip_type: 'Friends getaway',
          travel_date: '2024-02-29',
          user: {
            username: 'Discover07172583530',
            user_location: {id: '294225', name: 'Indonesia'},
            avatar: {
              thumbnail:
                'https://media-cdn.tripadvisor.com/media/photo-t/1a/f6/df/2b/default-avatar-2020-39.jpg',
              small:
                'https://media-cdn.tripadvisor.com/media/photo-l/1a/f6/df/2b/default-avatar-2020-39.jpg',
              medium:
                'https://media-cdn.tripadvisor.com/media/photo-f/1a/f6/df/2b/default-avatar-2020-39.jpg',
              large:
                'https://media-cdn.tripadvisor.com/media/photo-p/1a/f6/df/2b/default-avatar-2020-39.jpg',
              original:
                'https://media-cdn.tripadvisor.com/media/photo-o/1a/f6/df/2b/default-avatar-2020-39.jpg',
            },
          },
          subratings: {},
        },
        {
          id: 904305044,
          lang: 'en',
          location_id: 580602,
          published_date: '2023-07-20T06:13:50Z',
          rating: 1,
          helpful_votes: 2,
          rating_image_url:
            'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
          url: 'https://www.tripadvisor.com/ShowUserReviews-g294013-d580602-r904305044-Reviews-Al_Diar_Mina_Hotel-Abu_Dhabi_Emirate_of_Abu_Dhabi.html?m=66827#review904305044',
          text: 'Urgent Complaint Regarding Room Incident and Negligence\n\nI am writing to express my strong dissatisfaction and concern regarding a highly distressing incident that occurred during my recent stay at your hotel. I booked room 608 and experienced a severe breach of privacy and security.\n\nWhile I was taking a shower, someone entered my room and left the door wide open. Despite reporting this to your front desk, no action was taken, and my request for a written complaint was ignored. To add to my frustration, I returned later that evening to find the room without electricity.\n\nAs a regular and loyal customer, I find such negligence completely unacceptable. This incident not only violated my privacy but also compromised my safety. I am deeply disappointed by the lack of professionalism and the disregard for guest well-being.\n\nI expect an immediate and thorough investigation into this matter, along with a written response addressing the concerns raised. Restoring guest safety and providing a satisfactory resolution is imperative. Otherwise, I will have no choice but to escalate this complaint to the appropriate authorities.\n\nI trust that it will take swift and appropriate action to rectify this situation and restore my confidence in your establishment.\n\nSincerely,\n\nEmad Attia\nRoom 608 / 611',
          title: 'Terrible',
          trip_type: 'Couples',
          travel_date: '2023-07-31',
          user: {
            username: 'Relax29841036520',
            user_location: {id: '298061', name: 'Al Ain, Emirate of Abu Dhabi'},
            avatar: {
              thumbnail:
                'https://media-cdn.tripadvisor.com/media/photo-t/1a/f6/f2/59/default-avatar-2020-24.jpg',
              small:
                'https://media-cdn.tripadvisor.com/media/photo-l/1a/f6/f2/59/default-avatar-2020-24.jpg',
              medium:
                'https://media-cdn.tripadvisor.com/media/photo-f/1a/f6/f2/59/default-avatar-2020-24.jpg',
              large:
                'https://media-cdn.tripadvisor.com/media/photo-p/1a/f6/f2/59/default-avatar-2020-24.jpg',
              original:
                'https://media-cdn.tripadvisor.com/media/photo-o/1a/f6/f2/59/default-avatar-2020-24.jpg',
            },
          },
          subratings: {
            0: {
              name: 'RATE_VALUE',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s3.0-66827-5.svg',
              value: 3,
              localized_name: 'Value',
            },
            1: {
              name: 'RATE_LOCATION',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s2.0-66827-5.svg',
              value: 2,
              localized_name: 'Location',
            },
            2: {
              name: 'RATE_SERVICE',
              rating_image_url:
                'https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/s1.0-66827-5.svg',
              value: 1,
              localized_name: 'Service',
            },
          },
        },
      ],
    },
  },
  loadingAdditionalDetails: null,
};

export const getHotelDetailsThunk = createAsyncThunk(
  'hotels/getHotelDetail',
  async ({details}, {rejectWithValue}) => {
    try {
      console.log('details', details);
      const response = await getHotelDetails({details: details});
      console.log('response', response);

      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting hotels', error);
    }
  },
);

export const getAdditionalDetail = createAsyncThunk(
  'hotels/additionalDetails',
  async ({details}, {rejectWithValue}) => {
    try {
      const response = await getAdditionalDetails({details: details});
      return response.result;
    } catch (error) {
      return rejectWithValue('Error getting additional details', error);
    }
  },
);

const hotelDetailSlice = createSlice({
  name: 'hotelDetailSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getHotelDetailsThunk.pending, state => {
        state.loadingHotels = true;
        state.hotel = null;
      })
      .addCase(getHotelDetailsThunk.fulfilled, (state, action) => {
        state.loadingHotels = false;
        state.hotel = action.payload;
      })
      .addCase(getHotelDetailsThunk.rejected, (state, action) => {
        state.loadingHotels = false;
        console.log('Rejected hotel request', action.payload);
      })
      .addCase(getAdditionalDetail.pending, state => {
        state.loadingAdditionalDetails = true;
      })
      .addCase(getAdditionalDetail.fulfilled, (state, action) => {
        state.loadingAdditionalDetails = false;
        state.additionalDetails = action.payload;
      })
      .addCase(getAdditionalDetail.rejected, (state, action) => {
        state.loadingAdditionalDetails = false;
        console.log('Rejected additional details request', action.payload);
      });
  },
});

export default hotelDetailSlice.reducer;
