"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  MailOpen,
  Trash2,
  MoreHorizontal,
  Calendar,
  Phone,
  Reply,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { createBrowserClient } from "@/lib/supabase";
import { ContactMessage } from "@/lib/types";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (message: ContactMessage) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ lu: true })
        .eq("id", message.id);

      if (error) throw error;

      setMessages(
        messages.map((m) => (m.id === message.id ? { ...m, lu: true } : m)),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAsHandled = async (message: ContactMessage) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ traite: !message.traite })
        .eq("id", message.id);

      if (error) throw error;

      setMessages(
        messages.map((m) =>
          m.id === message.id ? { ...m, traite: !m.traite } : m,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", selectedMessage.id);

      if (error) throw error;

      setMessages(messages.filter((m) => m.id !== selectedMessage.id));
      setDeleteDialogOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const openDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setDetailsOpen(true);
    if (!message.lu) {
      markAsRead(message);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sujet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "nonlu" && !message.lu) ||
      (statusFilter === "lu" && message.lu) ||
      (statusFilter === "traite" && message.traite) ||
      (statusFilter === "nontraite" && !message.traite);

    return matchesSearch && matchesStatus;
  });

  const nonLuCount = messages.filter((m) => !m.lu).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500">
            Gérez les messages reçus via le formulaire de contact
            {nonLuCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {nonLuCount} non lu{nonLuCount > 1 ? "s" : ""}
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les messages</SelectItem>
                <SelectItem value="nonlu">Non lus</SelectItem>
                <SelectItem value="lu">Lus</SelectItem>
                <SelectItem value="nontraite">Non traités</SelectItem>
                <SelectItem value="traite">Traités</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">Aucun message trouvé</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Expéditeur</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={!message.lu ? "bg-blue-50/50" : undefined}
                  >
                    <TableCell>
                      {message.lu ? (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="h-4 w-4 text-blue-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p
                          className={`font-medium ${!message.lu ? "text-blue-900" : ""}`}
                        >
                          {message.nom}
                        </p>
                        <p className="text-sm text-gray-500">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openDetails(message)}
                        className="text-left hover:text-primary-600"
                      >
                        <p
                          className={`font-medium ${!message.lu ? "text-blue-900" : ""}`}
                        >
                          {message.sujet}
                        </p>
                        <p className="text-sm text-gray-500 truncate max-w-[250px]">
                          {message.message}
                        </p>
                      </button>
                    </TableCell>
                    <TableCell>
                      {message.traite ? (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Traité
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="mr-1 h-3 w-3" />
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(message.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openDetails(message)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Voir le message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open(
                                `mailto:${message.email}?subject=Re: ${message.sujet}`,
                              )
                            }
                          >
                            <Reply className="mr-2 h-4 w-4" />
                            Répondre
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => markAsHandled(message)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {message.traite
                              ? "Marquer non traité"
                              : "Marquer comme traité"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedMessage(message);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Message Details Sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Détails du message</SheetTitle>
          </SheetHeader>
          {selectedMessage && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Expéditeur
                </h3>
                <p className="mt-1 font-medium">{selectedMessage.nom}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Mail className="h-3 w-3" />
                  {selectedMessage.email}
                </div>
                {selectedMessage.telephone && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {selectedMessage.telephone}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-500">Sujet</h3>
                <p className="mt-1 font-medium">{selectedMessage.sujet}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Reçu le {formatDate(selectedMessage.created_at)}</span>
                {selectedMessage.traite ? (
                  <Badge className="bg-green-100 text-green-700">Traité</Badge>
                ) : (
                  <Badge variant="secondary">En attente</Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() =>
                    window.open(
                      `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.sujet}`,
                    )
                  }
                >
                  <Reply className="mr-2 h-4 w-4" />
                  Répondre
                </Button>
                <Button
                  variant="outline"
                  onClick={() => markAsHandled(selectedMessage)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {selectedMessage.traite ? "Non traité" : "Traité"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le message</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message de "
              {selectedMessage?.nom}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
