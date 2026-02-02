import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { getAllRegistrations, updateRegistrationStatus } from "@/lib/supabase";
import { CheckCircle, Clock, Globe, Loader2, Mail, MapPin, Phone, User, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const InscriptionsManager = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const filters = filter !== 'all' ? { status: filter, limit: 100 } : { limit: 100 };
      const response = await getAllRegistrations(filters);
      
      if (response.success && response.data) {
        setRegistrations(response.data);
      } else {
        toast({
          title: "Erreur",
          description: response.error || "Impossible de charger les inscriptions",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [filter]);

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const response = await updateRegistrationStatus(id, newStatus);
      
      if (response.success) {
        toast({
          title: "✓ Statut mis à jour",
          description: `L'inscription a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`,
        });
        // Mise à jour locale pour éviter l'erreur de coercion JSON
        setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
        setSelectedReg(null);
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut. Vérifiez vos droits admin.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={14} className="mr-1" /> En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 text-white"><CheckCircle size={14} className="mr-1" /> Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle size={14} className="mr-1" /> Rejeté</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-semibold tracking-tight">Inscriptions</h2>
        <p className="text-muted-foreground mt-2">Gérer et approuver les inscriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card><CardHeader className="pb-2"><CardDescription>Total</CardDescription><CardTitle className="text-3xl">{stats.total}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>En attente</CardDescription><CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Approuvées</CardDescription><CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Rejetées</CardDescription><CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle></CardHeader></Card>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Toutes</Button>
        <Button variant={filter === 'pending' ? 'default' : 'outline'} onClick={() => setFilter('pending')}>En attente</Button>
        <Button variant={filter === 'approved' ? 'default' : 'outline'} onClick={() => setFilter('approved')}>Approuvées</Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Pays/Ville</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedReg(reg)}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border">
                          {reg.photo_url ? (
                            <img src={reg.photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-full h-full p-2 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{reg.first_name} {reg.last_name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.country || 'Sénégal'}, {reg.city}</TableCell>
                      <TableCell>{reg.age} ans</TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell><Button size="sm" variant="ghost">Voir</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border">
                    {selectedReg?.photo_url ? (
                        <img src={selectedReg.photo_url} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-full h-full p-4 text-muted-foreground bg-muted" />
                    )}
                </div>
                <div>
                    <DialogTitle className="text-2xl font-serif">{selectedReg?.first_name} {selectedReg?.last_name}</DialogTitle>
                    <DialogDescription>Inscrit le {selectedReg && new Date(selectedReg.createdAt || selectedReg.created_at).toLocaleDateString()}</DialogDescription>
                </div>
            </div>
          </DialogHeader>

          {selectedReg && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                <div>{getStatusBadge(selectedReg.status)}</div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Sexe</p>
                    <p className="text-sm font-medium flex items-center gap-1 justify-end">
                        <Users size={14} className="text-primary" /> 
                        {selectedReg.gender === 'female' || selectedReg.gender === 'femme' ? 'Femme' : 'Homme'}
                    </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-xl"><p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Mail size={14} /> Email</p><p className="text-sm font-medium">{selectedReg.email}</p></div>
                <div className="p-3 border rounded-xl"><p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Phone size={14} /> Téléphone</p><p className="text-sm font-medium">{selectedReg.phone}</p></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs font-bold text-muted-foreground uppercase">Âge</p><p className="text-sm font-medium">{selectedReg.age} ans</p></div>
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><MapPin size={14} /> Ville</p><p className="text-sm font-medium">{selectedReg.city}</p></div>
                <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2"><Globe size={14} /> Pays</p><p className="text-sm font-medium">{selectedReg.country || 'Sénégal'}</p></div>
              </div>

              <div><p className="text-xs font-bold text-muted-foreground uppercase mb-2">Présentation</p><div className="bg-muted/50 rounded-xl p-4"><p className="text-sm italic">"{selectedReg.presentation}"</p></div></div>
              <div><p className="text-xs font-bold text-muted-foreground uppercase mb-2">Recherche</p><div className="bg-muted/50 rounded-xl p-4"><p className="text-sm">{selectedReg.lookingFor || selectedReg.looking_for}</p></div></div>

              {selectedReg.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleStatusChange(selectedReg.id, 'approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white"><CheckCircle size={16} className="mr-2" /> Approuver</Button>
                  <Button onClick={() => handleStatusChange(selectedReg.id, 'rejected')} variant="destructive" className="flex-1"><XCircle size={16} className="mr-2" /> Rejeter</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};