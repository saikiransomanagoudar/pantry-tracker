import { useState, useEffect, useRef } from "react";
import { firestore } from "@/firebase/firebase_api";
// import { signInWithRedirect, GoogleAuthProvider } from "@/firebase/auth";
import { GoSignOut } from "react-icons/go";
import { useRouter } from "next/router";
import { useAuth } from "@/firebase/auth";
import Spinner from "@/components/Spinner";
import { Box, Modal, Typography, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  where,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const { authUser, isLoading, signOut } = useAuth();
  // const [inventory, setInventory] = useState([]);
  const [fullInventory, setFullInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const searchRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    } else {
      loadInitialInventory();
    }
  }, [isLoading, authUser, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchMessage(""); // Clear the search message if clicked outside
      }
    };

    // Add when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  const loadInitialInventory = async () => {
    const snapshot = query(collection(firestore, "pantry-tracker"));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      name: doc.id,
      quantity: doc.data().quantity,
    }));
    setFullInventory(inventoryList);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchMessage("Please enter a search term.");
      return;
    }
    const searchTermLower = searchTerm.trim().toLowerCase();
    const filteredResults = fullInventory.filter((item) =>
      item.name.toLowerCase().includes(searchTermLower)
    );

    if (filteredResults.length > 0) {
      const resultsDisplay = filteredResults
        .map((item) => `${searchTerm} - Quantity: ${item.quantity}`)
        .join(", ");
      setSearchMessage(
        `${filteredResults.length} items found: ${resultsDisplay}`
      );
    } else {
      setSearchMessage(`No items found for '${searchTerm}'`);
    }
  };

  const addItem = async (item) => {
    if (!item.trim()) return;
    const newItem = item.trim().toLowerCase();
    const docRef = doc(collection(firestore, "pantry-tracker"), newItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newQuantity = data.quantity + 1;
      await setDoc(docRef, { ...data, quantity: newQuantity });
      // Update fullInventory directly
      setFullInventory((prev) =>
        prev.map((i) =>
          i.name === newItem ? { ...i, quantity: newQuantity } : i
        )
      );
    } else {
      const newData = { name: newItem, searchName: newItem, quantity: 1 };
      await setDoc(docRef, newData);
      // Add new item to fullInventory
      setFullInventory((prev) => [...prev, { name: newItem, quantity: 1 }]);
    }
  };

  const removeItem = async (item) => {
    const newItem = item.trim().toLowerCase();
    const docRef = doc(collection(firestore, "pantry-tracker"), newItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.quantity > 1) {
        const newQuantity = data.quantity - 1;
        await setDoc(docRef, { ...data, quantity: newQuantity });
        // Update fullInventory to reflect this change
        setFullInventory((prev) =>
          prev.map((i) =>
            i.name === newItem ? { ...i, quantity: newQuantity } : i
          )
        );
      } else {
        await deleteDoc(docRef);
        // Remove the item from fullInventory
        setFullInventory((prev) => prev.filter((i) => i.name !== newItem));
      }
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return !authUser ? (
    <Spinner />
  ) : (
    <main>
      <div
        className="bg-slate-600 text-white w-44 py-4 mt-5 rounded-lg 
        transition-transform hover:bg-black/[0.8] active:scale-90 
        flex items-center justify-center gap-2 font:medium 
        shadow-md fixed bottom-90 right-5 cursor-pointer"
        onClick={signOut}
      >
        <GoSignOut size={15} />
        <span>Logout</span>
      </div>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ width: "auto", padding: 2 }}
      >
        <TextField
          label="Search Items"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small" // Optional: Adjust the size to fit better with the button
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          SEARCH
        </Button>
      </Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {searchMessage}
      </Typography>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)",
            }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Box border="1px solid #333">
          <Box
            width="800px"
            height="100px"
            bgcolor="#ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">
              Pantry Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow="auto">
            {fullInventory.length > 0
              ? fullInventory.map(({ name, quantity }) => (
                  <Box
                    key={name}
                    width="100%"
                    minHeight="50px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    bgcolor="f0f0f0"
                    padding={2}
                  >
                    <Typography variant="h5" color="#333" flexGrow={1}>
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="#333"
                      flexGrow={1}
                      textAlign="center"
                    >
                      {quantity}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      flexGrow={1}
                      justifyContent="flex-end"
                    >
                      <Button variant="contained" onClick={() => addItem(name)}>
                        Add
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => removeItem(name)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Box>
                ))
              : null}
          </Stack>
        </Box>
      </Box>
    </main>
  );
}
