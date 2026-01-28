import { useEffect, useState } from "react";
import { getAllRegistrations, updateRegistrationStatus, type RegistrationRecord } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Briefcase, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const InscriptionsManager = () => {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
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
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du chargement",
        variant: "destructive",
      });
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
        loadRegistrations();
        setSelectedReg(null);
      } else {
        toast({
          title: "Erreur",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock size={14} className="mr-1" /> En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle size={14} className="mr-1" /> Approuvé</Badge>;
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
        <h2 className="text-3xl font-serif font-semibold tracking-tight">
          Inscriptions
        </h2>
        <p className="text-muted-foreground mt-2">
          Gérer et approuver les inscriptions
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Inscriptions totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approuvées</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Validées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rejetées</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Refusées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Toutes ({stats.total})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          En attente ({stats.pending})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approuvées ({stats.approved})
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejetées ({stats.rejected})
        </Button>
      </div>

      {/* Tableau des inscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Inscriptions</CardTitle>
          <CardDescription>
            {filter === 'all' ? 'Toutes les inscriptions' : `Inscriptions ${filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvées' : 'rejetées'}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucune inscription pour le moment</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedReg(reg)}>
                      <TableCell className="font-medium">
                        {reg.firstName} {reg.lastName}
                      </TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.city}</TableCell>
                      <TableCell>{reg.age} ans</TableCell>
                      <TableCell>{getStatusBadge(reg.status)}</TableCell>
                      <TableCell>
                        {new Date(reg.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReg(reg);
                          }}
                        >
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de détails */}
      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User size={20} />
              {selectedReg?.firstName} {selectedReg?.lastName}
            </DialogTitle>
            <DialogDescription>
              Inscription du {selectedReg && new Date(selectedReg.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </DialogDescription>
          </DialogHeader>

          {selectedReg && (
            <div className="space-y-6">
              {/* Statut */}
              <div>
                <p className="text-sm font-medium mb-2">Statut</p>
                {getStatusBadge(selectedReg.status)}
              </div>

              {/* Informations de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </p>
                  <a href={`mailto:${selectedReg.email}`} className="text-sm text-primary hover:underline">
                    {selectedReg.email}
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Phone size={16} /> Téléphone
                  </p>
                  <a href={`tel:${selectedReg.phone}`} className="text-sm text-primary hover:underline">
                    {selectedReg.phone}
                  </a>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Âge</p>
                  <p className="text-sm text-muted-foreground">{selectedReg.age} ans</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <MapPin size={16} /> Ville
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedReg.city}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    <Briefcase size={16} /> Profession
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedReg.profession || 'Non renseignée'}</p>
                </div>
              </div>

              {/* Présentation */}
              <div>
                <p className="text-sm font-medium mb-2">Présentation</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedReg.presentation}</p>
                </div>
              </div>

              {/* Recherche */}
              <div>
                <p className="text-sm font-medium mb-2">Recherche</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedReg.lookingFor}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedReg.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleStatusChange(selectedReg.id, 'approved')}
                    className="flex-1"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedReg.id, 'rejected')}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle size={16} className="mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
