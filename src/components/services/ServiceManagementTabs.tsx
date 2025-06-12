'use client';

import type { Service, Item } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ServiceFormDialog from './ServiceFormDialog';
import ItemFormDialog from './ItemFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// Dummy data - replace with actual data fetching and state management
const initialServices: Service[] = [
  { id: 's1', name: 'Exterior Cleaning', description: 'Full exterior wash and detailing.', price: 150, durationMinutes: 120, associatedItemIds: ['i1'] },
  { id: 's2', name: 'Window Washing', description: 'Interior and exterior window cleaning.', price: 80, durationMinutes: 60 },
  { id: 's3', name: 'Gutter Cleaning', description: 'Removal of debris from gutters.', price: 120, durationMinutes: 90, associatedItemIds: ['i2', 'i3'] },
];

const initialItems: Item[] = [
  { id: 'i1', name: 'PowerClean X Solution', description: 'Heavy-duty cleaning agent.', price: 25.99, stock: 50 },
  { id: 'i2', name: 'Ladder (10ft)', description: 'Standard extension ladder.', price: 5.00, stock: 5 }, // price could be rental/usage cost
  { id: 'i3', name: 'Safety Harness', description: 'For high-altitude work.', price: 2.00, stock: 10 },
];


export default function ServiceManagementTabs() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Service Handlers
  const handleAddService = () => { setSelectedService(undefined); setIsServiceFormOpen(true); };
  const handleEditService = (service: Service) => { setSelectedService(service); setIsServiceFormOpen(true); };
  const handleSubmitService = async (data: any) => {
    if (selectedService) {
      setServices(services.map(s => s.id === selectedService.id ? { ...selectedService, ...data } : s));
    } else {
      setServices([...services, { ...data, id: String(Date.now()) }]);
    }
  };
  const handleDeleteService = (serviceId: string) => {
    setServices(services.filter(s => s.id !== serviceId));
    toast({ title: "Service Deleted", description: "The service has been removed."});
    setServiceToDelete(null);
  };

  // Item Handlers
  const handleAddItem = () => { setSelectedItem(undefined); setIsItemFormOpen(true); };
  const handleEditItem = (item: Item) => { setSelectedItem(item); setIsItemFormOpen(true); };
  const handleSubmitItem = async (data: any) => {
    if (selectedItem) {
      setItems(items.map(i => i.id === selectedItem.id ? { ...selectedItem, ...data } : i));
    } else {
      setItems([...items, { ...data, id: String(Date.now()) }]);
    }
  };
   const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId));
    // Also remove this item from any service's associatedItemIds
    setServices(currentServices => 
        currentServices.map(service => ({
            ...service,
            associatedItemIds: service.associatedItemIds?.filter(id => id !== itemId)
        }))
    );
    toast({ title: "Item Deleted", description: "The item has been removed and unlinked from services."});
    setItemToDelete(null);
  };

  const getItemName = (itemId: string) => items.find(i => i.id === itemId)?.name || 'Unknown Item';


  return (
    <Tabs defaultValue="services" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="services">Services</TabsTrigger>
        <TabsTrigger value="items">Items</TabsTrigger>
      </TabsList>
      <TabsContent value="services">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>Add, edit, or delete services offered.</CardDescription>
            </div>
            <Button onClick={handleAddService}><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Associated Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>${service.price.toFixed(2)}</TableCell>
                    <TableCell>{service.durationMinutes ? `${service.durationMinutes} min` : 'N/A'}</TableCell>
                    <TableCell>
                      {service.associatedItemIds && service.associatedItemIds.length > 0 
                        ? service.associatedItemIds.map(id => getItemName(id)).join(', ') 
                        : 'None'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}><Edit2 className="h-4 w-4" /></Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setServiceToDelete(service.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {services.length === 0 && <p className="text-center text-muted-foreground p-4">No services created yet.</p>}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="items">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
             <div>
              <CardTitle>Manage Items</CardTitle>
              <CardDescription>Add, edit, or delete items like products or materials.</CardDescription>
            </div>
            <Button onClick={handleAddItem}><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.stock ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}><Edit2 className="h-4 w-4" /></Button>
                       <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setItemToDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {items.length === 0 && <p className="text-center text-muted-foreground p-4">No items created yet.</p>}
          </CardContent>
        </Card>
      </TabsContent>

      {isServiceFormOpen && (
        <ServiceFormDialog
          isOpen={isServiceFormOpen}
          onClose={() => setIsServiceFormOpen(false)}
          onSubmit={handleSubmitService}
          service={selectedService}
          allItems={items}
        />
      )}
      {isItemFormOpen && (
        <ItemFormDialog
          isOpen={isItemFormOpen}
          onClose={() => setIsItemFormOpen(false)}
          onSubmit={handleSubmitItem}
          item={selectedItem}
        />
      )}
      <AlertDialog open={!!itemToDelete || !!serviceToDelete} onOpenChange={() => { setItemToDelete(null); setServiceToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete ? 'item' : 'service'}
              {itemToDelete ? ' and unlink it from any services.' : '.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setItemToDelete(null); setServiceToDelete(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) handleDeleteItem(itemToDelete);
                if (serviceToDelete) handleDeleteService(serviceToDelete);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
