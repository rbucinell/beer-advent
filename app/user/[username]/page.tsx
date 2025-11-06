"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { redirectTo } from "@/app/actions/redirect";
import { Container, Avatar, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Box, Paper } from '@mui/material';
import { IAuthUser } from '@/app/models/authuser';
import { Get } from '@/app/util/RequestHelper';
import { IBeer } from '@/app/models/beer';
import BeerListItem from '@/components/Beer/BeerListItem';
import UserAvatar from '@/components/UserAvatar';
import { useUserByUsername, useUserBeers } from '@/app/hooks/hooks';

export default function UserPage() {

  const { username } = useParams<{ username:string }>();

  if( !username ) {
    redirectTo("/404")
  }

  const { users, usersError, usersLoading } = useUserByUsername(username);
  const user = users?.at(0);
  const userId = user?._id.toString();
  const { beers, beersError, beersLoading } = useUserBeers(userId || '');

  // Group beers by year
  const beersByYear = useMemo(() => {
    if (!beers) return {};
    return beers.reduce((acc, beer) => {
      const year = beer.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(beer);
      return acc;
    }, {} as Record<number, IBeer[]>);
  }, [beers]);

  // Sort years in descending order
  const sortedYears = useMemo(
    () => Object.keys(beersByYear).map(Number).sort((a, b) => b - a), 
    [beersByYear]
  );

  if (usersLoading) {
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
    <Container style={{ marginTop: '2rem', width: '100%', overflow: 'scroll', scrollBehavior: 'smooth' }} >
      <Paper elevation={2} sx={{ padding: 3, marginBottom: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <UserAvatar user={user} sx={{ width: 100, height: 100, marginRight: '1rem' }} />
          <div>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            {user.username && (
              <Typography variant="body2" color="textSecondary">@{user.username}</Typography>
            )}
          </div>
        </div>
      </Paper>

      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Beers Collection
        </Typography>
        
        {beersLoading ? (
          <Box sx={{ textAlign: 'center', padding: 3 }}>
            <CircularProgress size={30} />
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
              Loading beers...
            </Typography>
          </Box>
        ) : sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <Paper key={year} elevation={1} sx={{ marginBottom: 3, padding: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {year}
              </Typography>
              <Divider sx={{ marginBottom: 2 }} />
              <List>
                {beersByYear[year].map((beer) => (
                  <BeerListItem key={`${beer.year}${beer.day}${beer.beer}`} beer={beer} />
                ))}
              </List>
            </Paper>
          ))
        ) : (
          <Paper elevation={1} sx={{ padding: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No beers found in collection
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}