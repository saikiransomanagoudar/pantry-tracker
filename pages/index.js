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
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const { authUser, isLoading, signOut } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    } else {
      updateInventory();
    }
  }, [isLoading, authUser]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "pantry-tracker"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      const data = doc.data();
      if (data && typeof data.quantity === "number") {
        inventoryList.push({
          name: doc.id,
          quantity: data.quantity,
        });
      }
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    if (!item.trim()) return;
    const docRef = doc(collection(firestore, "pantry-tracker"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && typeof data.quantity === "number") {
        await setDoc(docRef, { quantity: data.quantity + 1 });
      }
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry-tracker"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && typeof data.quantity === "number" && data.quantity > 1) {
        await setDoc(docRef, { quantity: data.quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    updateInventory();
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
            {inventory.length > 0
              ? inventory.map(({ name, quantity }) => (
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
