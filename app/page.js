'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Typography, Button, TextField, Card, CardContent, Grid, Modal, Fade, Backdrop, Container } from "@mui/material";
import { getDocs, query, collection, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";

export default function PantryManager() {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [newCount, setNewCount] = useState(0);
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCount, setEditCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInventory = async () => {
    const snapshot = await getDocs(query(collection(firestore, 'pantry')));
    const inventoryList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  const addItem = async () => {
    if (newItem.trim() !== '') {
      await addDoc(collection(firestore, 'pantry'), {
        name: newItem,
        count: newCount,
      });
      setNewItem('');
      setNewCount(0);
      fetchInventory();
    }
  };

  const updateItem = async (item) => {
    const docRef = doc(firestore, 'pantry', item.id);
    await updateDoc(docRef, {
      count: item.count + 1,
    });
    fetchInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(firestore, 'pantry', item.id);
    await deleteDoc(docRef);
    fetchInventory();
  };

  const editItemModal = async (item) => {
    setEditItem(item);
    setEditName(item.name);
    setEditCount(item.count);
    setOpen(true);
  };

  const saveEditedItem = async () => {
    if (editName.trim() !== '') {
      const docRef = doc(firestore, 'pantry', editItem.id);
      await updateDoc(docRef, {
        name: editName,
        count: editCount,
      });
      setEditItem(null);
      setEditName('');
      setEditCount(0);
      setOpen(false);
      fetchInventory();
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: 'background.paper' }}>
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Typography variant='h1' gutterBottom>
          Pantry Manager
        </Typography>
        <TextField
          label="Search Items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            sx: {
              bgcolor: 'white',
            },
          }}
          sx={{ 
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              },
              '&:hover fieldset': {
                borderColor: 'secondary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'success.main',
              },
            },
          }}
        />
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                Add New Item
              </Typography>
              <TextField
                label="Item Name"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Count"
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(parseInt(e.target.value))}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Button variant="contained" color="primary" onClick={addItem} fullWidth>
                Add to Pantry
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h5' color="primary" gutterBottom>
                Pantry Items
              </Typography>
              {filteredInventory.map((item) => (
                <Card key={item.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant='h6'>{item.name}</Typography>
                      <Typography variant='body1'>Count: {item.count}</Typography>
                    </Box>
                    <Box>
                      <Button variant="contained" color="primary" onClick={() => updateItem(item)} sx={{ mr: 1 }}>
                        +
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => editItemModal(item)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button variant="contained" color="error" onClick={() => removeItem(item)}>
                        -
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box p={4} bgcolor="background.paper" borderRadius={4}>
            <Typography variant='h5' gutterBottom>
              Edit Item
            </Typography>
            <TextField
              label="Item Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Count"
              type="number"
              value={editCount}
              onChange={(e) => setEditCount(parseInt(e.target.value))}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={saveEditedItem} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="contained" color="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
