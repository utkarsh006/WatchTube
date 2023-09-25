import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { Videos, Sidebar } from './'
import ScrollToTopButton from './TopButton'
import Loader from './Loader'
import { fetchVideos } from '../utils/fetchFromAPI'

const Feed = () => {
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'New'
  const year = new Date().getFullYear()
  const nexPageToken = useRef(null)
  const [videosToDisplay, setVideosToDisplay] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetchVideos({
        pageToken: nexPageToken.current,
        category: selectedCategory
      })
      const { items, nextPageToken } = response
      setVideosToDisplay((prevState) => [...prevState, ...items])
      nexPageToken.current = nextPageToken
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  
  useEffect(() => {
    setVideosToDisplay([])
    fetchData();
  }, [selectedCategory]);

  return (
    <Stack sx={{ flexDirection: { sx: 'column', md: 'row' } }}>
      <Box
        sx={{
          height: { sx: 'auto', md: '92vh' },
          borderRight: '1px solid #3d3d3d',
          px: { sx: 0, md: 2 },
        }}
      >
        <Sidebar />
      </Box>

      <Box p={2} sx={{ overflowY: 'auto', minHeight: '90vh', flex: 2 }}>
        <Typography
          variant='h4'
          fontWeight='bold'
          mb={2}
          sx={{ color: 'white' }}
        >
          {selectedCategory} <span style={{ color: '#FC1503' }}>videos</span>
        </Typography>

        <Suspense fallback={<Loader />}>
          <Videos videos={videosToDisplay} />
        </Suspense>
      </Box>
      <ScrollToTopButton />
    </Stack>
  )
}

export default Feed
