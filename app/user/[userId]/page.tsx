"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Avatar, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Box } from '@mui/material';
import { IUsers } from '@/app/models/user';
import { Get } from '@/app/util/RequestHelper';
import { IBeer } from '@/app/models/beer';
import BeerListItem from '@/components/Beer/BeerListItem';
import UserAvatar from '@/components/UserAvatar';

export default function UserPage() {
  const { userId } = useParams();
  const [user, setUser] = useState({} as IUsers);
  const [beers, setBeers] = useState([] as IBeer[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        console.log(userId);
        const userData = await Get<IUsers>(`/api/user/${userId}`);
        setUser(userData);
        if (userData) {
          const beerData = await Get<IBeer[]>(`/api/beer?user=${userId}`);
          beerData.sort((a, b) => b.year - a.year);
          setBeers(beerData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" color="textSecondary" style={{ marginTop: '1rem' }}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          User not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '2rem', width: '100%' }} >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <UserAvatar user={user} sx={{ width: 100, height: 100, marginRight: '1rem' }} />
        <div>
          <Typography variant="h4">{`${user.firstName} ${user.lastName}`}</Typography>
          <Typography variant="body1" color="textSecondary">{user.email}</Typography>
        </div>
      </div>
      <Box sx={{ marginBottom: '1rem', bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>Beers:</Typography>
        <List>
          {beers.length > 0 ? beers.map((beer => (
            <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} beer={beer} />
          ))) : (
            <Typography variant="body1" color="textSecondary">No beers found</Typography>
          )}
        </List>
      </Box>
    </Container>
  );
}
