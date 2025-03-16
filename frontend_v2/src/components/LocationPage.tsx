import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, MapPin, Users } from 'lucide-react';
const LocationPage = () => {
  const {
    id
  } = useParams();
  // Mock data for a specific location
  // In a real app, you would fetch this data based on the ID
  const locationData = {
    id,
    name: id === '1' ? 'Downtown Coffee Shop' : id === '2' ? 'Central Park' : id === '3' ? 'Tech Museum' : id === '4' ? 'Riverside Restaurant' : 'Community Library',
    crowdLevel: id === '1' || id === '4' ? 'high' : id === '2' ? 'medium' : 'low',
    description: id === '1' ? 'A popular coffee shop in the heart of downtown. Known for its artisanal brews and comfortable atmosphere.' : id === '2' ? 'A large urban park with walking trails, picnic areas, and recreational facilities.' : id === '3' ? 'An interactive museum showcasing the latest in technology and innovation.' : id === '4' ? 'Upscale dining with stunning views of the river. Specializes in seafood and local cuisine.' : 'A quiet space for reading and studying with an extensive collection of books and digital resources.',
    address: '123 Main St',
    image: id === '1' ? 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' : id === '2' ? 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1078&q=80' : id === '3' ? 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' : id === '4' ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80' : 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: [{
      id: '1',
      user: 'Sarah Johnson',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      caption: 'Having a great time at this place! The atmosphere is amazing.',
      likes: 124,
      comments: 18,
      timeAgo: '2 hours ago'
    }, {
      id: '2',
      user: 'Mike Peters',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1047&q=80',
      caption: 'Just discovered this hidden gem. Definitely coming back soon!',
      likes: 87,
      comments: 9,
      timeAgo: '5 hours ago'
    }, {
      id: '3',
      user: 'Emily Wilson',
      userImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
      image: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      caption: 'Perfect spot for a weekend hangout with friends.',
      likes: 156,
      comments: 23,
      timeAgo: '1 day ago'
    }]
  };
  return <div className="bg-gray-50 min-h-screen">
      {/* Location header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </Link>
            <div>
              <h1 className="font-bold text-xl">{locationData.name}</h1>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{locationData.address}</span>
                <div className="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className={`${locationData.crowdLevel === 'high' ? 'text-red-600' : locationData.crowdLevel === 'medium' ? 'text-orange-500' : 'text-green-600'}`}>
                    {locationData.crowdLevel === 'high' ? 'Very busy' : locationData.crowdLevel === 'medium' ? 'Moderately busy' : 'Not busy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Location hero */}
      <div className="relative h-64 md:h-96 w-full">
        <img src={locationData.image} alt={locationData.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {locationData.name}
            </h2>
            <p className="max-w-lg mx-auto">{locationData.description}</p>
          </div>
        </div>
      </div>
      {/* Posts feed */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
        <div className="space-y-6">
          {locationData.posts.map(post => <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Post header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <img src={post.userImage} alt={post.user} className="h-10 w-10 rounded-full object-cover" />
                  <div className="ml-3">
                    <p className="font-medium">{post.user}</p>
                    <p className="text-xs text-gray-500">{post.timeAgo}</p>
                  </div>
                </div>
                <button>
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Post image */}
              <img src={post.image} alt="Post" className="w-full h-96 object-cover" />
              {/* Post actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center">
                      <Heart className="h-6 w-6 text-gray-600" />
                    </button>
                    <button className="flex items-center">
                      <MessageCircle className="h-6 w-6 text-gray-600" />
                    </button>
                    <button className="flex items-center">
                      <Share2 className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                  <button>
                    <Bookmark className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
                <p className="font-medium mb-1">{post.likes} likes</p>
                <p>
                  <span className="font-medium">{post.user}</span>{' '}
                  {post.caption}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  View all {post.comments} comments
                </p>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center">
                    <input type="text" placeholder="Add a comment..." className="flex-1 outline-none text-sm" />
                    <button className="text-blue-500 font-medium text-sm">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default LocationPage;